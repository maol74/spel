Object.assign(App.prototype, {
    initMalaGame() {
        const div = this.screens['game-mala'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 800px; margin: 20px auto; padding: 20px; text-align: center;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h1 style="margin: 0; color: #4ECDC4;">Bokstavs-Målaren 🎨</h1>
                    <div style="display: flex; gap: 10px;">
                        <button class="menu-card" style="width: auto; padding: 5px 15px; margin: 0; background: #E74C3C; border-color: #C0392B;" onclick="window.gameApp.clearMalaCanvas()">Rensa 🗑️</button>
                        <button class="menu-card" style="width: auto; padding: 5px 15px; margin: 0; background: #2ECC71; border-color: #27AE60;" onclick="window.gameApp.finishMala()">Klar! ✅</button>
                    </div>
                </div>

                <div style="position: relative; background: white; border-radius: 20px; aspect-ratio: 1/1; cursor: crosshair; overflow: hidden; border: 10px solid #EDF2F7;">
                    <div id="mala-letter-bg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 25rem; color: #E2E8F0; font-weight: bold; user-select: none; pointer-events: none;">A</div>
                    <canvas id="mala-canvas" style="width: 100%; height: 100%; position: relative; z-index: 2; touch-action: none;"></canvas>
                </div>
                
                <div style="margin-top: 20px; display: flex; justify-content: center; gap: 10px;">
                    ${['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ECC71', '#3498DB', '#9B59B6', '#000000'].map(c => `
                        <div style="width: 40px; height: 40px; background: ${c}; border-radius: 50%; cursor: pointer; border: 3px solid transparent;" onclick="window.gameApp.setMalaColor('${c}', this)"></div>
                    `).join('')}
                </div>

                <div style="margin-top: 30px;">
                    <button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('letter-menu')">Tillbaka</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.setupMalaCanvas();
        this.nextMalaLetter();
    },

    setupMalaCanvas() {
        const canvas = document.getElementById('mala-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        this.malaColor = '#4ECDC4';
        this.malaSize = 25;
        this.isMalaPainting = false;
        
        const startPaint = (e) => {
            this.isMalaPainting = true;
            const pos = this.getCanvasPos(e, canvas);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.strokeStyle = this.malaColor;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = this.malaSize;
        };

        const doPaint = (e) => {
            if (!this.isMalaPainting) return;
            const pos = this.getCanvasPos(e, canvas);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };

        const stopPaint = () => {
            this.isMalaPainting = false;
        };

        canvas.onmousedown = startPaint;
        canvas.onmousemove = doPaint;
        window.onmouseup = stopPaint;
        
        canvas.ontouchstart = (e) => { e.preventDefault(); startPaint(e.touches[0]); };
        canvas.ontouchmove = (e) => { e.preventDefault(); doPaint(e.touches[0]); };
        canvas.ontouchend = stopPaint;
    },

    nextMalaLetter() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const bg = document.getElementById('mala-letter-bg');
        if (bg) bg.innerText = letter;
        this.clearMalaCanvas();
    },

    setMalaColor(color, el) {
        this.malaColor = color;
        document.querySelectorAll('.mala-color-active').forEach(e => e.style.borderColor = 'transparent');
        if (el) {
            el.style.borderColor = 'white';
            el.classList.add('mala-color-active');
        }
    },

    clearMalaCanvas() {
        const canvas = document.getElementById('mala-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    },

    finishMala() {
        this.addScore(3);
        this.incrementProgress();
        this.showToast('Vilken fin bokstav! Superduktigt! 🎨✨');
        this.cheer('jump');
        setTimeout(() => this.nextMalaLetter(), 2000);
    }
});
