Object.assign(App.prototype, {
    initCreatorScreen() {
        const div = this.screens['creator-screen'];
        
        // Färgpalett
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ECC71', '#3498DB', '#9B59B6', '#FFFFFF', '#000000'];
        
        // Verktyg
        const tools = [
            { id: 'pen', icon: '✏️', name: 'Penna' },
            { id: 'brush', icon: '🖌️', name: 'Pensel' },
            { id: 'marker', icon: '🖍️', name: 'Överstrykningspenna' },
            { id: 'sticker', icon: '✨', name: 'Klistermärke' },
            { id: 'bg', icon: '🎨', name: 'Bakgrund' }
        ];

        // Samla alla tillgängliga klistermärken
        let availableStickers = CONFIG.avatars.filter(a => a.price === 0).map(a => a.icon);
        if (this.state.purchasedItems) {
            this.state.purchasedItems.forEach(id => {
                const a = CONFIG.avatars.find(av => av.id === id);
                if (a && !availableStickers.includes(a.icon)) availableStickers.push(a.icon);
            });
        }

        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 1000px; margin: 20px auto; padding: 20px; display: flex; flex-direction: column; height: 85vh;">
                
                <!-- Top Bar -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h1 style="margin: 0; color: #FF6B6B; text-shadow: 0 4px 10px rgba(255, 107, 107, 0.3);">Skaparlådan 🎨</h1>
                    <div style="display: flex; gap: 10px;">
                        <button class="menu-card" style="width: auto; padding: 8px 15px; margin: 0; background: #34495E; border-color: #2C3E50; font-size: 1rem;" onclick="window.gameApp.undoPaint()" title="Ångra sista draget">Ångra ↩️</button>
                        <button class="menu-card" style="width: auto; padding: 8px 15px; margin: 0; background: #E74C3C; border-color: #C0392B; font-size: 1rem;" onclick="window.gameApp.clearCanvas()" title="Rensa allt">Rensa 🗑️</button>
                        <button class="menu-card" style="width: auto; padding: 8px 15px; margin: 0; background: #2ECC71; border-color: #27AE60; font-size: 1rem;" onclick="window.gameApp.showScreen('main-menu')">Stäng 💾</button>
                    </div>
                </div>

                <div style="display: flex; flex-grow: 1; gap: 20px; min-height: 0;">
                    
                    <!-- Toolbar (Left) -->
                    <div style="width: 80px; display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 20px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); overflow-y: auto; overflow-x: hidden;">
                        
                        <!-- Colors -->
                        <div style="display: flex; flex-direction: column; gap: 6px;" id="creator-colors">
                            ${colors.map(c => `
                                <div class="creator-color-btn" data-color="${c}" style="width: 32px; height: 32px; background: ${c}; border-radius: 50%; border: 3px solid ${c === '#FFFFFF' ? '#CBD5E0' : 'transparent'}; cursor: pointer; margin: 0 auto; transition: transform 0.2s, border-color 0.2s;" onclick="window.gameApp.setPaintColor('${c}')"></div>
                            `).join('')}
                        </div>

                        <!-- Tools -->
                        <div style="margin-top: 5px; border-top: 2px solid rgba(255,255,255,0.1); padding-top: 8px; text-align: center; display: flex; flex-direction: column; gap: 6px;" id="creator-tools">
                            ${tools.map(t => `
                                <div class="creator-tool-btn" data-tool="${t.id}" style="font-size: 1.5rem; cursor: pointer; padding: 2px; border-radius: 8px; transition: background 0.2s, transform 0.2s;" onclick="window.gameApp.setPaintTool('${t.id}')" title="${t.name}">${t.icon}</div>
                            `).join('')}
                        </div>

                        <!-- Size Slider -->
                        <div style="margin-top: 10px; flex-grow: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; position: relative; padding-bottom: 5px;">
                            <div style="font-size: 0.6rem; color: #A0AEC0; font-weight: bold;">STORLEK</div>
                            <input type="range" min="2" max="60" value="${this.brushSize || 15}" 
                                   style="writing-mode: bt-lr; -webkit-appearance: slider-vertical; width: 20px; height: 70px; cursor: pointer;" 
                                   oninput="window.gameApp.setBrushSize(this.value)">
                            
                            <!-- Brush Size Preview -->
                            <div style="width: 40px; height: 40px; background: rgba(0,0,0,0.5); border-radius: 10px; display: flex; justify-content: center; align-items: center; margin-top: 5px; border: 1px solid rgba(255,255,255,0.1);">
                                <div id="creator-brush-preview" style="background: ${this.paintColor || '#FF6B6B'}; border-radius: 50%; width: ${this.brushSize || 15}px; height: ${this.brushSize || 15}px; transition: width 0.1s, height 0.1s, background 0.2s;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Canvas Area -->
                    <div style="flex-grow: 1; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; overflow: hidden; cursor: crosshair; background: white url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAnv37v3/n0mCQZJBSJUkR1HtkG1BihwAlWUL1XlWvUIAAAAASUVORK5CYII=') repeat;">
                        <canvas id="creator-canvas" style="width: 100%; height: 100%; touch-action: none; display: block;"></canvas>
                    </div>

                    <!-- Sticker Panel (Right) -->
                    <div id="sticker-panel" style="width: 180px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 20px; display: flex; flex-direction: column; gap: 15px; overflow-y: auto; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                        <div style="font-size: 0.8rem; text-align: center; color: #A0AEC0; font-weight: bold; letter-spacing: 1px;">KLISTERMÄRKEN</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;" id="creator-stickers">
                            ${availableStickers.map(icon => `
                                <div class="creator-sticker-btn" data-sticker="${icon}" style="font-size: 2.5rem; cursor: pointer; text-align: center; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 15px; border: 2px solid transparent; transition: transform 0.2s, background 0.2s;" onclick="window.gameApp.selectSticker('${icon}')">${icon}</div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            ${this.getCheerleader()}
        `;

        this.undoStack = [];
        this.setupCanvas();
        
        // Initial state logic
        this.paintColor = this.paintColor || '#FF6B6B';
        this.paintMode = this.paintMode || 'brush';
        this.brushType = this.brushType || 'brush';
        this.brushSize = this.brushSize || 15;
        this.selectedSticker = this.selectedSticker || null;
        
        this.updateCreatorUI();
    },

    updateCreatorUI() {
        // Highlight active color
        document.querySelectorAll('.creator-color-btn').forEach(btn => {
            if (btn.dataset.color === this.paintColor) {
                btn.style.transform = 'scale(1.2)';
                btn.style.borderColor = 'white';
                btn.style.boxShadow = `0 0 15px ${this.paintColor}`;
            } else {
                btn.style.transform = 'scale(1)';
                btn.style.borderColor = btn.dataset.color === '#FFFFFF' ? '#CBD5E0' : 'transparent';
                btn.style.boxShadow = 'none';
            }
        });

        // Highlight active tool
        const activeToolId = this.paintMode === 'sticker' ? 'sticker' : (this.paintMode === 'bg' ? 'bg' : this.brushType);
        document.querySelectorAll('.creator-tool-btn').forEach(btn => {
            if (btn.dataset.tool === activeToolId) {
                btn.style.background = 'rgba(255, 255, 255, 0.2)';
                btn.style.transform = 'scale(1.1)';
            } else {
                btn.style.background = 'transparent';
                btn.style.transform = 'scale(1)';
            }
        });

        // Highlight active sticker
        document.querySelectorAll('.creator-sticker-btn').forEach(btn => {
            if (this.paintMode === 'sticker' && btn.dataset.sticker === this.selectedSticker) {
                btn.style.background = 'rgba(255,255,255,0.2)';
                btn.style.borderColor = '#F1C40F';
                btn.style.transform = 'scale(1.1)';
            } else {
                btn.style.background = 'rgba(255,255,255,0.05)';
                btn.style.borderColor = 'transparent';
                btn.style.transform = 'scale(1)';
            }
        });

        // Update brush preview
        const preview = document.getElementById('creator-brush-preview');
        if (preview) {
            preview.style.width = `${this.brushSize}px`;
            preview.style.height = `${this.brushSize}px`;
            if (this.paintMode === 'brush') {
                preview.style.background = this.paintColor;
                preview.style.borderRadius = this.brushType === 'marker' ? '0%' : '50%';
            } else {
                preview.style.background = 'transparent';
            }
        }
    },

    setupCanvas() {
        const canvas = document.getElementById('creator-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.parentElement.getBoundingClientRect();
        
        // Setup resolution
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Save initial blank state
        this.saveCanvasState();
        
        this.isPainting = false;
        
        const startPaint = (e) => {
            this.isPainting = true;
            this.saveCanvasState(); // Save state BEFORE we start drawing
            
            const pos = this.getCanvasPos(e, canvas);
            
            if (this.paintMode === 'brush') {
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                
                ctx.strokeStyle = this.paintColor;
                ctx.lineJoin = 'round';
                
                if (this.brushType === 'pen') {
                    ctx.lineCap = 'round';
                    ctx.globalAlpha = 1.0;
                    ctx.lineWidth = this.brushSize * 0.6;
                    ctx.shadowBlur = 0;
                } else if (this.brushType === 'brush') {
                    ctx.lineCap = 'round';
                    ctx.globalAlpha = 0.8;
                    ctx.lineWidth = this.brushSize;
                    ctx.shadowBlur = this.brushSize / 2;
                    ctx.shadowColor = this.paintColor;
                } else if (this.brushType === 'marker') {
                    ctx.lineCap = 'square';
                    ctx.globalAlpha = 0.4;
                    ctx.lineWidth = this.brushSize * 1.5;
                    ctx.shadowBlur = 0;
                }
                
                // Draw a dot on click
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();

            } else if (this.paintMode === 'sticker' && this.selectedSticker) {
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 0;
                ctx.font = `${this.brushSize * 4}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.selectedSticker, pos.x, pos.y);
                
                // Jump animation on the sticker button
                const btn = document.querySelector(`.creator-sticker-btn[data-sticker="${this.selectedSticker}"]`);
                if(btn) {
                    btn.style.animation = 'none';
                    void btn.offsetWidth;
                    btn.style.animation = 'jump 0.3s ease';
                }
                
            } else if (this.paintMode === 'bg') {
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 0;
                ctx.fillStyle = this.paintColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                this.showToast('Bakgrundsfärg ändrad! 🎨');
            }
        };

        const doPaint = (e) => {
            if (!this.isPainting || this.paintMode !== 'brush') return;
            const pos = this.getCanvasPos(e, canvas);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };

        const stopPaint = () => {
            if (this.isPainting && this.paintMode === 'brush') {
                ctx.closePath();
            }
            this.isPainting = false;
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
        };

        canvas.onmousedown = startPaint;
        window.addEventListener('mousemove', (e) => { if(this.state.currentScreen === 'creator-screen') doPaint(e); });
        window.addEventListener('mouseup', () => { if(this.state.currentScreen === 'creator-screen') stopPaint(); });
        
        canvas.ontouchstart = (e) => { e.preventDefault(); startPaint(e.touches[0]); };
        window.addEventListener('touchmove', (e) => { if(this.state.currentScreen === 'creator-screen') { e.preventDefault(); doPaint(e.touches[0]); } }, {passive: false});
        window.addEventListener('touchend', () => { if(this.state.currentScreen === 'creator-screen') stopPaint(); });
    },

    getCanvasPos(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    },

    setPaintColor(color) {
        this.paintColor = color;
        // If we were on sticker, switch back to previous brush type, otherwise keep current tool
        if (this.paintMode === 'sticker') this.paintMode = 'brush'; 
        this.updateCreatorUI();
    },

    setPaintTool(tool) {
        if (tool === 'sticker') {
            this.paintMode = 'sticker';
            if (!this.selectedSticker) {
                const stickers = document.querySelectorAll('.creator-sticker-btn');
                if (stickers.length > 0) this.selectedSticker = stickers[0].dataset.sticker;
            }
        } else if (tool === 'bg') {
            this.paintMode = 'bg';
            this.showToast('Klicka på duken för att fylla med färg! 🖌️');
        } else {
            this.paintMode = 'brush';
            this.brushType = tool;
        }
        this.updateCreatorUI();
    },

    setBrushSize(size) {
        this.brushSize = parseInt(size);
        this.updateCreatorUI();
    },

    selectSticker(icon) {
        this.selectedSticker = icon;
        this.paintMode = 'sticker';
        this.updateCreatorUI();
    },

    saveCanvasState() {
        const canvas = document.getElementById('creator-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            // Keep maximum 20 undo steps
            if (this.undoStack.length > 20) this.undoStack.shift();
            this.undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
    },

    undoPaint() {
        if (this.undoStack.length > 0) {
            const canvas = document.getElementById('creator-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const lastState = this.undoStack.pop();
                ctx.putImageData(lastState, 0, 0);
            }
        } else {
            this.showToast('Finns inget mer att ångra! 🤷');
        }
    },

    clearCanvas() {
        const canvas = document.getElementById('creator-canvas');
        if (canvas) {
            this.saveCanvasState(); // Save before clearing so they can undo the clear!
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.showToast('Sidan rensad! 🗑️');
        }
    }
});
