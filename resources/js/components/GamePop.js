Object.assign(App.prototype, {
    initGamePop() {
        const div = this.screens['game-pop'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="pop-container" style="position: relative; width: 800px; height: 500px; margin: 0 auto; background: linear-gradient(to bottom, #87CEEB, #E0F7FA); border-radius: 30px; overflow: hidden; border: 5px solid #4DD0E1; cursor: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" style=\"font-size:32px\"><text y=\"32\">🔫</text></svg>') 16 16, crosshair; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                
                <div id="pop-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white; cursor: default;">
                    <h1 id="pop-status-text" style="font-size: 3rem; margin-bottom: 20px;">GAME OVER</h1>
                    <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.5rem;" onclick="window.gameApp.initGamePop()">Spela Igen! 🔄</button>
                    <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('spel-menu')">Tillbaka till menyn 🏠</button>
                </div>

                <div id="pop-lives" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 1.2rem; z-index: 10; letter-spacing: 5px; border: 2px solid #E74C3C;">
                    ❤️❤️❤️
                </div>

                <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; z-index: 10;">
                    <div style="background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 0.9rem; border: 2px solid #3498DB;">
                        FART: <span id="pop-speed">0.0</span>
                    </div>
                    <div id="pop-score" style="background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 1.2rem; border: 2px solid #F1C40F; backdrop-filter: blur(5px);">
                        BALLONGER: <span id="pop-count">0</span> / 30
                    </div>
                </div>

                <div id="pop-area" style="width: 100%; height: 100%;"></div>
                <div style="position: absolute; bottom: 20px; left: 20px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); font-weight: bold; font-size: 1.2rem;">
                    Sikta och skjut ballongerna! 🔫🎈
                </div>
            </div>
        `;
        
        const container = document.getElementById('pop-container');
        container.onclick = (e) => {
            if (!this.popActive) return;
            this.createMuzzleFlash(e.clientX, e.clientY);
        };

        this.popCount = 0;
        this.popLives = 3;
        this.popActive = true;
        
        const speedHud = document.getElementById('pop-speed');

        if (this.popLoop) clearInterval(this.popLoop);
        this.popLoop = setInterval(() => {
            if (this.popActive) {
                this.spawnBalloon();
                const currentSpeed = 1.2 + (this.state.difficulty * 0.4) + (this.popCount * 0.05);
                if (speedHud) speedHud.innerText = currentSpeed.toFixed(1);
            }
        }, 1200 - (this.state.difficulty * 100));
    },

    updatePopLivesDisplay() {
        const livesEl = document.getElementById('pop-lives');
        if (livesEl) {
            livesEl.innerText = '❤️'.repeat(this.popLives);
        }
    },

    showPopEnd(won) {
        this.popActive = false;
        if (this.popLoop) clearInterval(this.popLoop);
        
        const overlay = document.getElementById('pop-overlay');
        const statusText = document.getElementById('pop-status-text');
        if (overlay && statusText) {
            overlay.classList.remove('hidden');
            statusText.innerText = won ? 'PANG! 🎉🎈\nGrymt jobbat! 🏆' : 'SLUT PÅ SKOTT! 🔫👻';
            statusText.style.color = won ? '#F1C40F' : '#E74C3C';
        }
        if (won) {
            this.state.score += 50;
            this.incrementProgress();
            this.saveState();
        }
    },

    createMuzzleFlash(x, y) {
        const flash = document.createElement('div');
        flash.innerText = '💥';
        flash.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            pointer-events: none;
            z-index: 100;
            animation: popOut 0.2s ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 200);
    },

    spawnBalloon() {
        const area = document.getElementById('pop-area');
        if (!area) return;
        
        const b = document.createElement('div');
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6', '#E67E22', '#4A90E2'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 80 + Math.random() * 50;
        
        b.style.cssText = `
            position: absolute;
            bottom: -150px;
            left: ${10 + Math.random() * 80}%;
            width: ${size}px;
            height: ${size * 1.2}px;
            background: ${color};
            border-radius: 50% 50% 50% 50% / 45% 45% 55% 55%;
            cursor: pointer;
            box-shadow: inset -10px -10px 20px rgba(0,0,0,0.2), 5px 5px 15px rgba(0,0,0,0.1);
            transition: opacity 0.2s;
            z-index: 5;
            padding: 20px;
            margin: -20px;
        `;
        
        const gloss = document.createElement('div');
        gloss.style.cssText = `position: absolute; top: 15%; left: 20%; width: 25%; height: 15%; background: rgba(255,255,255,0.4); border-radius: 50%; transform: rotate(-30deg); pointer-events: none;`;
        b.appendChild(gloss);
        
        const string = document.createElement('div');
        string.style.cssText = `position: absolute; bottom: -30px; left: 50%; width: 2px; height: 40px; background: rgba(0,0,0,0.15); transform: translateX(-50%); pointer-events: none;`;
        b.appendChild(string);
        
        b.onclick = (e) => {
            e.stopPropagation();
            this.createMuzzleFlash(e.clientX, e.clientY);
            this.popBalloon(b);
        };
        
        area.appendChild(b);
        
        const speed = 1.2 + Math.random() * 1.5 + (this.state.difficulty * 0.4) + (this.popCount * 0.05);
        let drift = (Math.random() - 0.5) * 1.5;
        let pos = -150;
        const sizePct = (size / 800) * 100; // Container is 800px wide
        
        const move = () => {
            if (!this.popActive || !b.parentNode || this.state.currentScreen !== 'game-pop') {
                if (b.parentNode) b.remove();
                return;
            }
            pos += speed;
            b.style.bottom = pos + 'px';
            
            let currentLeft = parseFloat(b.style.left) + drift;
            
            // Bounce against edges
            if (currentLeft <= 0) {
                currentLeft = 0;
                drift = Math.abs(drift); // Bounce right
            } else if (currentLeft + sizePct >= 100) {
                currentLeft = 100 - sizePct;
                drift = -Math.abs(drift); // Bounce left
            }
            
            b.style.left = currentLeft + '%';
            
            if (pos > 600) {
                b.remove();
                this.popLives--;
                this.updatePopLivesDisplay();
                if (this.popLives <= 0) {
                    this.showPopEnd(false);
                } else {
                    this.showToast('Hoppsan! En ballong slapp undan! ❤️');
                }
            } else {
                requestAnimationFrame(move);
            }
        };
        requestAnimationFrame(move);
    },

    popBalloon(el) {
        if (!this.popActive) return;
        
        this.popCount++;
        const countEl = document.getElementById('pop-count');
        if (countEl) countEl.innerText = this.popCount;
        
        el.style.transform = 'scale(1.5)';
        el.style.opacity = '0';
        
        const rect = el.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width/2}px;
                top: ${rect.top + rect.height/2}px;
                width: 10px;
                height: 10px;
                background: ${el.style.background};
                border-radius: 50%;
                pointer-events: none;
                z-index: 20;
                transition: all 0.5s ease-out;
            `;
            document.body.appendChild(p);
            const tx = (Math.random() - 0.5) * 200;
            const ty = (Math.random() - 0.5) * 200;
            setTimeout(() => {
                p.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                p.style.opacity = '0';
            }, 10);
            setTimeout(() => p.remove(), 600);
        }
        
        if (this.popCount >= 30) {
            this.showPopEnd(true);
        }
        
        setTimeout(() => { if (el.parentNode) el.remove(); }, 150);
    }
});
