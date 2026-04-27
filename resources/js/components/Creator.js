Object.assign(App.prototype, {
    initCreatorScreen() {
        const div = this.screens['creator-screen'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 1000px; margin: 20px auto; padding: 20px; display: flex; flex-direction: column; height: 85vh;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h1 style="margin: 0; color: #FF6B6B;">Skaparlådan 🎨</h1>
                    <div style="display: flex; gap: 10px;">
                        <button class="menu-card" style="width: auto; padding: 5px 15px; margin: 0; background: #E74C3C; border-color: #C0392B;" onclick="window.gameApp.clearCanvas()">Rensa 🗑️</button>
                        <button class="menu-card" style="width: auto; padding: 5px 15px; margin: 0; background: #2ECC71; border-color: #27AE60;" onclick="window.gameApp.showScreen('main-menu')">Spara 💾</button>
                    </div>
                </div>

                <div style="display: flex; flex-grow: 1; gap: 20px; min-height: 0;">
                    <!-- Toolbar -->
                    <div style="width: 80px; display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 20px;">
                        ${['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ECC71', '#3498DB', '#9B59B6', '#FFFFFF', '#000000'].map(c => `
                            <div class="color-picker" style="width: 40px; height: 40px; background: ${c}; border-radius: 50%; border: 3px solid ${c === '#FFFFFF' ? '#CBD5E0' : 'transparent'}; cursor: pointer; margin: 0 auto;" onclick="window.gameApp.setPaintColor('${c}')"></div>
                        `).join('')}
                        <div style="margin-top: 10px; border-top: 1px solid #4A5568; padding-top: 10px; text-align: center; display: flex; flex-direction: column; gap: 15px;">
                            <div style="font-size: 1.5rem; cursor: pointer;" onclick="window.gameApp.setBrushType('pen')" title="Penna">✏️</div>
                            <div style="font-size: 1.5rem; cursor: pointer;" onclick="window.gameApp.setBrushType('brush')" title="Pensel">🖌️</div>
                            <div style="font-size: 1.5rem; cursor: pointer;" onclick="window.gameApp.setBrushType('marker')" title="Överstrykningspenna">🖍️</div>
                            <div style="font-size: 1.5rem; cursor: pointer;" onclick="window.gameApp.setPaintMode('sticker')" title="Klistermärken">✨</div>
                        </div>
                        <div style="margin-top: 20px; flex-grow: 1; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                            <div style="font-size: 0.7rem; color: #A0AEC0;">STORLEK</div>
                            <input type="range" min="2" max="60" value="${this.brushSize || 15}" 
                                   style="writing-mode: bt-lr; -webkit-appearance: slider-vertical; width: 20px; height: 100px;" 
                                   oninput="window.gameApp.setBrushSize(this.value)">
                        </div>
                    </div>

                    <!-- Canvas Area -->
                    <div style="flex-grow: 1; background: white; border-radius: 20px; box-shadow: inset 0 0 20px rgba(0,0,0,0.1); position: relative; overflow: hidden; cursor: crosshair;">
                        <canvas id="creator-canvas" style="width: 100%; height: 100%; touch-action: none;"></canvas>
                    </div>

                    <!-- Sticker Panel -->
                    <div id="sticker-panel" style="width: 150px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 20px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto;">
                        <div style="font-size: 0.8rem; text-align: center; color: #A0AEC0; margin-bottom: 5px;">KLISTERMÄRKEN</div>
                        ${(this.state.purchasedItems || []).map(id => {
                            const a = CONFIG.avatars.find(av => av.id === id);
                            return a ? `<div style="font-size: 2.5rem; cursor: pointer; text-align: center; transition: transform 0.2s;" onclick="window.gameApp.selectSticker('${a.icon}')" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">${a.icon}</div>` : '';
                        }).join('')}
                        ${CONFIG.avatars.filter(a => a.price === 0).map(a => `
                            <div style="font-size: 2.5rem; cursor: pointer; text-align: center; transition: transform 0.2s;" onclick="window.gameApp.selectSticker('${a.icon}')" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">${a.icon}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
            ${this.getCheerleader()}
        `;

        this.setupCanvas();
    },

    setupCanvas() {
        const canvas = document.getElementById('creator-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        this.paintColor = '#FF6B6B';
        this.paintMode = 'brush';
        this.brushType = 'brush';
        this.brushSize = this.brushSize || 15;
        this.selectedSticker = null;
        this.isPainting = false;
        
        const startPaint = (e) => {
            this.isPainting = true;
            const pos = this.getCanvasPos(e, canvas);
            if (this.paintMode === 'brush') {
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                
                // Set tool properties
                ctx.strokeStyle = this.paintColor;
                ctx.lineJoin = 'round';
                ctx.lineWidth = this.brushSize;
                
                if (this.brushType === 'pen') {
                    ctx.lineCap = 'round';
                    ctx.globalAlpha = 1.0;
                } else if (this.brushType === 'brush') {
                    ctx.lineCap = 'round';
                    ctx.globalAlpha = 1.0;
                } else if (this.brushType === 'marker') {
                    ctx.lineCap = 'square';
                    ctx.globalAlpha = 0.4;
                }
            } else if (this.paintMode === 'sticker' && this.selectedSticker) {
                ctx.globalAlpha = 1.0;
                ctx.font = `${this.brushSize * 4}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.selectedSticker, pos.x, pos.y);
            }
        };

        const doPaint = (e) => {
            if (!this.isPainting || this.paintMode !== 'brush') return;
            const pos = this.getCanvasPos(e, canvas);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };

        const stopPaint = () => {
            this.isPainting = false;
            // Reset alpha so it doesn't affect other things if we don't reset it
            const canvas = document.getElementById('creator-canvas');
            if (canvas) canvas.getContext('2d').globalAlpha = 1.0;
        };

        canvas.onmousedown = startPaint;
        canvas.onmousemove = doPaint;
        window.onmouseup = stopPaint;
        
        canvas.ontouchstart = (e) => { e.preventDefault(); startPaint(e.touches[0]); };
        canvas.ontouchmove = (e) => { e.preventDefault(); doPaint(e.touches[0]); };
        canvas.ontouchend = stopPaint;
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
        this.paintMode = 'brush';
        this.showToast('Färg ändrad! 🎨');
    },

    setPaintMode(mode) {
        this.paintMode = mode;
        this.showToast(mode === 'brush' ? 'Måla fritt! 🖌️' : 'Välj ett klistermärke! ✨');
    },

    setBrushType(type) {
        this.brushType = type;
        this.paintMode = 'brush';
        const names = { pen: 'Penna ✏️', brush: 'Pensel 🖌️', marker: 'Överstrykningspenna 🖍️' };
        this.showToast(`Verktyg: ${names[type]}`);
    },

    setBrushSize(size) {
        this.brushSize = parseInt(size);
    },

    selectSticker(icon) {
        this.selectedSticker = icon;
        this.paintMode = 'sticker';
        this.showToast(`Klistermärke valt: ${icon} ✨`);
    },

    clearCanvas() {
        const canvas = document.getElementById('creator-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.showToast('Sidan rensad! 🗑️');
        }
    }
});
