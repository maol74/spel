Object.assign(App.prototype, {
    initGameCatch() {
        const div = this.screens['game-catch'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="catch-container" style="position: relative; width: 800px; height: 500px; margin: 0 auto; background: linear-gradient(to bottom, #78AB46, #C5E1A5); border-radius: 30px; overflow: hidden; border: 5px solid #558B2F; box-shadow: 0 15px 35px rgba(0,0,0,0.2); cursor: none;">
                
                <div id="catch-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white; cursor: default;">
                    <h1 id="catch-status-text" style="font-size: 3rem; margin-bottom: 20px;">GAME OVER</h1>
                    <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.5rem;" onclick="window.gameApp.initGameCatch()">Spela Igen! 🔄</button>
                    <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('spel-menu')">Tillbaka till menyn 🏠</button>
                </div>

                <div id="catch-lives" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 1.2rem; z-index: 10; letter-spacing: 5px; border: 2px solid #E74C3C;">
                    ❤️❤️❤️
                </div>

                <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; z-index: 10;">
                    <div style="background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 0.9rem; border: 2px solid #3498DB;">
                        FART: <span id="catch-speed">0.0</span>
                    </div>
                    <div id="catch-score" style="background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 1.2rem; border: 2px solid #F1C40F; backdrop-filter: blur(5px);">
                        FRUKT: <span id="catch-count">0</span> / 15
                    </div>
                </div>

                <div id="catch-area" style="width: 100%; height: 100%;">
                    <div id="basket" style="position: absolute; bottom: 20px; left: 50%; width: 100px; height: 60px; background: #8D6E63; border-radius: 10px 10px 40% 40%; transform: translateX(-50%); display: flex; justify-content: center; align-items: center; font-size: 2.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3); border: 4px solid #5D4037; z-index: 15; transition: transform 0.1s;">🧺</div>
                </div>
                <div style="position: absolute; bottom: 20px; left: 20px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); font-weight: bold;">
                    Flytta korgen med musen för att fånga frukten! 🍎🍌🍐
                </div>
            </div>
        `;
        
        this.catchCount = 0;
        this.catchLives = 3;
        this.catchActive = true;
        this.basketPos = 400;
        
        const container = document.getElementById('catch-container');
        const basket = document.getElementById('basket');
        const speedHud = document.getElementById('catch-speed');
        
        this._catchMoveHandler = (e) => {
            if (!this.catchActive || this.state.currentScreen !== 'game-catch') return;
            const rect = container.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            let x = clientX - rect.left;
            if (x < 50) x = 50;
            if (x > 750) x = 750;
            this.basketPos = x;
            if (basket) basket.style.left = x + 'px';
        };
        
        window.removeEventListener('mousemove', this._catchMoveHandler);
        window.removeEventListener('touchmove', this._catchMoveHandler);
        window.addEventListener('mousemove', this._catchMoveHandler);
        window.addEventListener('touchmove', this._catchMoveHandler, { passive: false });

        if (this.catchLoop) clearInterval(this.catchLoop);
        this.catchLoop = setInterval(() => {
            if (this.catchActive) {
                this.spawnFruit();
                const currentSpeed = 2.5 + (this.state.difficulty * 0.8) + (this.catchCount * 0.1);
                if (speedHud) speedHud.innerText = currentSpeed.toFixed(1);
            }
        }, 1200 - (this.state.difficulty * 150));
    },

    updateCatchLivesDisplay() {
        const livesEl = document.getElementById('catch-lives');
        if (livesEl) {
            livesEl.innerText = '❤️'.repeat(this.catchLives);
        }
    },

    showCatchEnd(won) {
        this.catchActive = false;
        if (this.catchLoop) clearInterval(this.catchLoop);
        
        const overlay = document.getElementById('catch-overlay');
        const statusText = document.getElementById('catch-status-text');
        if (overlay && statusText) {
            overlay.classList.remove('hidden');
            statusText.innerText = won ? 'MUMS! VILKEN SALLAD! 🎉🥣' : 'SLUT PÅ FRUKT! 🍎👻';
            statusText.style.color = won ? '#F1C40F' : '#E74C3C';
        }
        if (won) {
            this.addScore(2);
            this.incrementProgress();
        }
    },

    spawnFruit() {
        const area = document.getElementById('catch-area');
        if (!area) return;
        
        const isHeart = Math.random() < 0.1;
        const fruits = ['🍎', '🍌', '🍐', '🍊', '🍇', '🍓', '🍒', '🍍'];
        const icon = isHeart ? '❤️' : fruits[Math.floor(Math.random() * fruits.length)];
        
        f.innerText = icon;
        if (isHeart) f.dataset.type = 'heart';
        f.style.cssText = `
            position: absolute;
            top: -50px;
            left: ${5 + Math.random() * 90}%;
            font-size: 3rem;
            user-select: none;
            z-index: 5;
            filter: drop-shadow(0 5px 5px ${isHeart ? 'rgba(231, 76, 60, 0.4)' : 'rgba(0,0,0,0.1)'});
        `;
        
        area.appendChild(f);
        
        const speed = 2.5 + Math.random() * 2 + (this.state.difficulty * 0.8) + (this.catchCount * 0.1);
        const rotationSpeed = (Math.random() - 0.5) * 10;
        let pos = -50;
        let rot = 0;
        
        const move = () => {
            if (!this.catchActive || !f.parentNode || this.state.currentScreen !== 'game-catch') {
                if (f.parentNode) f.remove();
                return;
            }
            pos += speed;
            rot += rotationSpeed;
            f.style.top = pos + 'px';
            f.style.transform = `rotate(${rot}deg)`;
            
            const fRect = f.getBoundingClientRect();
            const basketEl = document.getElementById('basket');
            if (!basketEl) return;
            const bRect = basketEl.getBoundingClientRect();
            
            if (fRect.bottom > bRect.top + 10 && fRect.top < bRect.bottom && 
                fRect.right > bRect.left && fRect.left < bRect.right) {
                if (f.dataset.type === 'heart') {
                    if (this.catchLives < 5) {
                        this.catchLives++;
                        this.updateCatchLivesDisplay();
                        this.showToast('EXTRALIV! ❤️');
                    } else {
                        this.catchCount = Math.min(this.catchCount + 2, 15);
                        this.showToast('SUPERBONUS! ✨');
                    }
                    f.remove();
                } else {
                    this.catchFruit(f);
                }
                return;
            }
            
            if (pos > 500) {
                const wasHeart = f.dataset.type === 'heart';
                f.remove();
                if (!wasHeart) {
                    this.catchLives--;
                    this.updateCatchLivesDisplay();
                    if (this.catchLives <= 0) {
                        this.showCatchEnd(false);
                    } else {
                        this.showToast('Hoppsan! Du tappade en frukt! ❤️');
                    }
                }
            } else {
                requestAnimationFrame(move);
            }
        };
        requestAnimationFrame(move);
    },

    catchFruit(el) {
        if (!this.catchActive) return;
        
        el.remove();
        this.whackEffect(el.getBoundingClientRect().left, el.getBoundingClientRect().top); // Reuse whack effect if possible or just remove
        this.catchCount++;
        const countEl = document.getElementById('catch-count');
        if (countEl) countEl.innerText = this.catchCount;
        
        const basket = document.getElementById('basket');
        if (basket) {
            basket.style.transform = 'translateX(-50%) scale(1.2)';
            setTimeout(() => {
                if (basket) basket.style.transform = 'translateX(-50%) scale(1)';
            }, 100);
        }
        
        if (this.catchCount >= 15) {
            this.showCatchEnd(true);
        }
    },

    whackEffect(x, y) {
        const effect = document.createElement('div');
        effect.innerText = '✨';
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            pointer-events: none;
            z-index: 100;
            animation: popOut 0.3s ease-out forwards;
        `;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 300);
    }
});
