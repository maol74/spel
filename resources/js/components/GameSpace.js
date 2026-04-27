Object.assign(App.prototype, {
    initGameSpace() {
        const div = this.screens['game-space'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="space-container" style="position: relative; width: 600px; height: 500px; margin: 0 auto; background: #0B0E14; border: 8px solid #2C3E50; border-radius: 30px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5); cursor: crosshair;">
                <div id="stars-bg" style="position: absolute; width: 100%; height: 200%; top: -100%; background: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.5; animation: spaceScroll 10s linear infinite;"></div>
                
                <div id="space-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white;">
                    <h1 id="space-status-text" style="font-size: 3rem; margin-bottom: 20px;">GAME OVER</h1>
                    <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.5rem;" onclick="window.gameApp.initGameSpace()">Spela Igen! 🔄</button>
                    <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('spel-menu')">Tillbaka till menyn 🏠</button>
                </div>

                <div id="space-lives" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 1.2rem; z-index: 20; letter-spacing: 5px; border: 2px solid #E74C3C;">
                    ❤️❤️❤️
                </div>

                <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; z-index: 20;">
                    <div style="background: rgba(0,0,0,0.7); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 0.9rem; border: 2px solid #3498DB;">
                        FART: <span id="space-speed">0.0</span>
                    </div>
                    <div id="space-score" style="background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 1.2rem; border: 2px solid #F1C40F; backdrop-filter: blur(5px);">
                        ALIENS: <span id="space-count">0</span> / 30
                    </div>
                </div>

                <div id="ship" style="position: absolute; bottom: 30px; left: 300px; transform: translateX(-50%); font-size: 3.5rem; z-index: 15; user-select: none; filter: drop-shadow(0 0 10px #3498DB);">🚀</div>
                <div id="space-area" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></div>
                <div style="position: absolute; bottom: 20px; left: 20px; color: #7F8C8D; font-weight: bold; text-shadow: 0 1px 2px black;">
                    Flytta med musen och klicka för att skjuta! 🚀🔥
                </div>
            </div>
            <style>
                @keyframes spaceScroll {
                    from { transform: translateY(0); }
                    to { transform: translateY(100px); }
                }
                .bullet { position: absolute; width: 6px; height: 20px; background: #FFEB3B; border-radius: 3px; box-shadow: 0 0 10px #FFEB3B, 0 0 20px #F44336; z-index: 12; }
                .alien { position: absolute; font-size: 2.5rem; z-index: 11; transition: transform 0.1s; }
            </style>
            <div class="game-controls" style="display: flex; gap: 20px; width: 600px; margin: 20px auto; max-width: 95%;">
                <button class="btn btn-skjut" style="height: 100px; font-size: 2rem;" onmousedown="window.gameApp.shootSpace()" ontouchstart="event.preventDefault(); window.gameApp.shootSpace()">SKJUT! 🔥</button>
            </div>
        `;
        
        this.spaceActive = true;
        this.spaceCount = 0;
        this.spaceLives = 3;
        
        this._spaceMoveHandler = (e) => {
            if (!this.spaceActive || this.state.currentScreen !== 'game-space') return;
            const container = document.getElementById('space-container');
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            let x = clientX - rect.left;
            if (x < 40) x = 40;
            if (x > 560) x = 560;
            const ship = document.getElementById('ship');
            if (ship) ship.style.left = x + 'px';
        };

        window.removeEventListener('mousemove', this._spaceMoveHandler);
        window.removeEventListener('touchmove', this._spaceMoveHandler);
        window.addEventListener('mousemove', this._spaceMoveHandler);
        window.addEventListener('touchmove', this._spaceMoveHandler, { passive: false });

        const containerEl = document.getElementById('space-container');
        if (containerEl) {
            containerEl.onclick = (e) => {
                if (!this.spaceActive) return;
                this.shootSpaceBullet();
            };
        }

        window.onkeydown = (e) => {
            if (!this.spaceActive || this.state.currentScreen !== 'game-space') return;
            if (e.key === ' ') {
                this.shootSpaceBullet();
                e.preventDefault();
            }
            const left = parseFloat(ship.style.left) || 300;
            if (e.key === 'ArrowLeft' && left > 40) ship.style.left = (left - 25) + 'px';
            if (e.key === 'ArrowRight' && left < 560) ship.style.left = (left + 25) + 'px';
        };

        if (this.spaceSpawnLoop) clearInterval(this.spaceSpawnLoop);
        this.spaceSpawnLoop = setInterval(() => {
            if (this.spaceActive) {
                this.spawnAlien();
                const currentSpeed = 1.2 + (this.state.difficulty * 0.6) + (this.spaceCount * 0.05);
                if (speedHud) speedHud.innerText = currentSpeed.toFixed(1);
            }
        }, 1200 - (this.state.difficulty * 120));
    },

    updateSpaceLivesDisplay() {
        const livesEl = document.getElementById('space-lives');
        if (livesEl) {
            livesEl.innerText = '❤️'.repeat(this.spaceLives);
        }
    },

    showSpaceEnd(won) {
        this.spaceActive = false;
        if (this.spaceSpawnLoop) clearInterval(this.spaceSpawnLoop);
        
        const overlay = document.getElementById('space-overlay');
        const statusText = document.getElementById('space-status-text');
        if (overlay && statusText) {
            overlay.classList.remove('hidden');
            statusText.innerText = won ? 'SEGER! 🎉🚀\nUniversum är säkert! 🏆' : 'GAME OVER! 👻\nUtomjordingarna vann!';
            statusText.style.color = won ? '#F1C40F' : '#E74C3C';
        }
        if (won) {
            this.addScore(2);
            this.incrementProgress();
        }
    },

    shootSpaceBullet() {
        const ship = document.getElementById('ship');
        const area = document.getElementById('space-area');
        const container = document.getElementById('space-container');
        if (!ship || !area || !container) return;
        
        const b = document.createElement('div');
        b.className = 'bullet';
        const sRect = ship.getBoundingClientRect();
        const cRect = container.getBoundingClientRect();
        
        const startX = sRect.left - cRect.left + sRect.width / 2 - 3;
        b.style.left = startX + 'px';
        b.style.bottom = '90px';
        area.appendChild(b);
        
        let bPos = 90;
        const moveBullet = () => {
            if (!this.spaceActive || !b.parentNode || this.state.currentScreen !== 'game-space') {
                if (b.parentNode) b.remove();
                return;
            }
            bPos += 10;
            b.style.bottom = bPos + 'px';
            
            if (bPos > 520) {
                b.remove();
            } else {
                const aliens = area.querySelectorAll('.alien');
                const bRect = b.getBoundingClientRect();
                
                for (let alien of aliens) {
                    const aRect = alien.getBoundingClientRect();
                    if (bRect.bottom > aRect.top && bRect.top < aRect.bottom && 
                        bRect.right > aRect.left && bRect.left < aRect.right) {
                        this.destroyAlien(alien, b);
                        return;
                    }
                }
                requestAnimationFrame(moveBullet);
            }
        };
        requestAnimationFrame(moveBullet);
    },

    spawnAlien() {
        const area = document.getElementById('space-area');
        if (!area) return;
        
        const a = document.createElement('div');
        a.className = 'alien';
        const isHeart = Math.random() < 0.1;
        const alienIcons = ['👾', '👽', '🛸', '👹', '💀'];
        a.innerText = isHeart ? '❤️' : alienIcons[Math.floor(Math.random() * alienIcons.length)];
        if (isHeart) a.dataset.type = 'heart';
        
        const startX = 30 + Math.random() * 540;
        a.style.left = startX + 'px';
        a.style.top = '-50px';
        area.appendChild(a);
        
        const speed = 1.2 + Math.random() * 1.5 + (this.state.difficulty * 0.6) + (this.spaceCount * 0.05);
        let aPos = -50;
        
        const moveAlien = () => {
            if (!this.spaceActive || !a.parentNode || this.state.currentScreen !== 'game-space') {
                if (a.parentNode) a.remove();
                return;
            }
            aPos += speed;
            a.style.top = aPos + 'px';
            a.style.transform = `translateX(${Math.sin(aPos/30) * 15}px)`;

            const aRect = a.getBoundingClientRect();
            const sRect = ship.getBoundingClientRect();
            if (aRect.bottom > sRect.top + 10 && aRect.top < sRect.bottom - 10 && 
                aRect.right > sRect.left + 5 && aRect.left < sRect.right - 5) {
                if (a.dataset.type === 'heart') {
                    if (this.spaceLives < 5) {
                        this.spaceLives++;
                        this.updateSpaceLivesDisplay();
                        this.showToast('EXTRALIV! ❤️');
                    } else {
                        this.spaceCount = Math.min(this.spaceCount + 3, 30);
                        this.showToast('SUPERBONUS! 🚀');
                        const countEl = document.getElementById('space-count');
                        if (countEl) countEl.innerText = this.spaceCount;
                    }
                    a.remove();
                    return;
                } else {
                    this.spaceLives--;
                    this.updateSpaceLivesDisplay();
                    this.showToast('KROCK! 💥');
                    a.remove();
                    if (this.spaceLives <= 0) this.showSpaceEnd(false);
                    return;
                }
            }
            
            if (aPos > 500) {
                const wasHeart = a.dataset.type === 'heart';
                a.remove();
                if (!wasHeart) {
                    this.spaceLives--;
                    this.updateSpaceLivesDisplay();
                    if (this.spaceLives <= 0) {
                        this.showSpaceEnd(false);
                    } else {
                        this.showToast('Hoppsan! En utomjording slank förbi! ❤️');
                    }
                }
            } else {
                requestAnimationFrame(moveAlien);
            }
        };
        requestAnimationFrame(moveAlien);
    },

    destroyAlien(alien, bullet) {
        if (!this.spaceActive) return;
        if (alien.dataset.type === 'heart') {
            if (bullet && bullet.parentNode) bullet.remove();
            return;
        }
        
        const aRect = alien.getBoundingClientRect();
        alien.remove();
        if (bullet && bullet.parentNode) bullet.remove();
        
        this.spaceCount++;
        const countEl = document.getElementById('space-count');
        if (countEl) countEl.innerText = this.spaceCount;
        
        const exp = document.createElement('div');
        exp.innerText = '💥';
        exp.style.cssText = `
            position: fixed;
            left: ${aRect.left}px;
            top: ${aRect.top}px;
            font-size: 3rem;
            pointer-events: none;
            z-index: 100;
            animation: popOut 0.4s ease-out forwards;
        `;
        document.body.appendChild(exp);
        setTimeout(() => exp.remove(), 400);
        
        if (this.spaceCount >= 30) {
            this.showSpaceEnd(true);
        }
    }
});
