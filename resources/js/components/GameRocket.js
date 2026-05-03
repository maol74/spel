Object.assign(App.prototype, {
    initRocketGame() {
        const div = this.screens['game-rocket'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="rocket-container" style="position: relative; width: 100%; height: calc(100vh - 120px); background: radial-gradient(circle at center, #1A202C 0%, #000000 100%); overflow: hidden; cursor: none;">
                
                <!-- Background Stars -->
                <div id="rocket-stars" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></div>
                
                <!-- Goal Info -->
                <div id="rocket-mission" style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); padding: 15px 30px; border-radius: 20px; border: 2px solid #F1C40F; text-align: center; z-index: 10; box-shadow: 0 0 20px rgba(241, 196, 15, 0.3);">
                    <div style="color: #A0AEC0; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">Uppdrag: Samla bränsle! 🚀</div>
                    <div id="rocket-target-display" style="color: #F1C40F; font-size: 2.5rem; font-weight: 900; margin-top: 5px;">A</div>
                </div>

                <!-- Speed & Progress -->
                <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 15px; align-items: center; z-index: 10;">
                    <!-- Speed Control -->
                    <div style="background: rgba(0,0,0,0.7); padding: 10px; border-radius: 15px; border: 2px solid #3498DB; color: white; text-align: center; width: 100px;">
                        <div style="font-size: 0.7rem; color: #A0AEC0; margin-bottom: 2px;">TAKT</div>
                        <div style="font-size: 1.2rem; font-weight: bold;"><span id="rocket-speed-text">1.0</span>x</div>
                        <div style="display: flex; gap: 5px; margin-top: 5px; justify-content: center;">
                            <button style="width: 30px; height: 30px; padding: 0; background: #2D3748; color: white; border: 1px solid #4A5568; border-radius: 5px; cursor: pointer;" onclick="window.gameApp.changeRocketSpeed(-0.2)">-</button>
                            <button style="width: 30px; height: 30px; padding: 0; background: #2D3748; color: white; border: 1px solid #4A5568; border-radius: 5px; cursor: pointer;" onclick="window.gameApp.changeRocketSpeed(0.2)">+</button>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div style="width: 50px; height: 250px; background: rgba(255,255,255,0.1); border-radius: 25px; border: 2px solid rgba(255,255,255,0.2); overflow: hidden; display: flex; flex-direction: column-reverse; position: relative;">
                        <div id="rocket-progress-fill" style="width: 100%; height: 30%; background: linear-gradient(to top, #E74C3C, #F1C40F); transition: height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);"></div>
                        <div style="position: absolute; top: 10px; left: 50%; transform: translateX(-50%); font-size: 1.2rem;">🌙</div>
                        <div style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); font-size: 1rem;">🌍</div>
                    </div>
                </div>

                <!-- Rocket -->
                <div id="rocket-obj" style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 80px; height: 120px; z-index: 5; transition: transform 0.1s ease-out; will-change: left;">
                    <div style="font-size: 5rem; text-shadow: 0 10px 20px rgba(0,0,0,0.5);">🚀</div>
                    <div id="rocket-fire" style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 2rem; opacity: 0.8;">🔥</div>
                </div>

                <!-- Game Area -->
                <div id="rocket-elements" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></div>

                <!-- Game Over Overlay -->
                <div id="rocket-gameover" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 100; flex-direction: column; justify-content: center; align-items: center; text-align: center; backdrop-filter: blur(5px);">
                    <div style="font-size: 6rem; margin-bottom: 10px;">💥😵</div>
                    <h2 style="color: #E74C3C; font-size: 3rem; margin: 0;">Slut på bränsle!</h2>
                    <p style="color: #A0AEC0; font-size: 1.5rem; margin-bottom: 30px;">Raketen kraschade...</p>
                    <div style="display: flex; gap: 20px;">
                        <button class="menu-card" style="width: auto; padding: 15px 40px; background: #2ECC71; border-color: #27AE60;" onclick="window.gameApp.initRocketGame()">Försök igen! 🚀</button>
                        <button class="menu-card" style="width: auto; padding: 15px 40px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('spel-menu')">Meny 🏠</button>
                    </div>
                </div>

                <!-- Back Button -->
                <div style="position: absolute; bottom: 20px; left: 20px; z-index: 20;">
                    ${this.getBackButton('spel-menu')}
                </div>
            </div>
        `;

        this.rocketState = {
            target: '',
            progress: 30, // Start with 30% fuel
            baseSpeed: 5,
            currentSpeed: 5,
            multiplier: 1.0,
            active: true,
            elements: [],
            lastSpawn: 0,
            x: window.innerWidth / 2
        };

        this.createRocketStars();
        this.nextRocketRound();
        this.startRocketLoop();

        // Global Controls
        this._rocketMoveHandler = (e) => {
            if (this.state.currentScreen !== 'game-rocket' || !this.rocketState.active) return;
            const container = document.getElementById('rocket-container');
            if (!container) return;
            const rect = container.getBoundingClientRect();
            
            let clientX = e.clientX || (e.touches && e.touches[0].clientX);
            if (clientX === undefined) return;

            this.rocketState.x = clientX - rect.left;
            const rocket = document.getElementById('rocket-obj');
            if (rocket) {
                rocket.style.left = `${this.rocketState.x}px`;
            }
        };

        window.removeEventListener('mousemove', this._rocketMoveHandler);
        window.removeEventListener('touchmove', this._rocketMoveHandler);
        window.addEventListener('mousemove', this._rocketMoveHandler);
        window.addEventListener('touchmove', this._rocketMoveHandler, { passive: false });
    },

    changeRocketSpeed(delta) {
        this.rocketState.multiplier = Math.max(0.4, Math.min(3.0, this.rocketState.multiplier + delta));
        this.updateRocketSpeedDisplay();
    },

    updateRocketSpeedDisplay() {
        const el = document.getElementById('rocket-speed-text');
        if (el) el.innerText = this.rocketState.multiplier.toFixed(1);
    },

    createRocketStars() {
        const stars = document.getElementById('rocket-stars');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 3;
            star.style.cssText = `
                position: absolute;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: ${size}px;
                height: ${size}px;
                background: white;
                border-radius: 50%;
                opacity: ${Math.random()};
            `;
            stars.appendChild(star);
        }
    },

    nextRocketRound() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");
        this.rocketState.target = letters[Math.floor(Math.random() * letters.length)];
        const targetDisplay = document.getElementById('rocket-target-display');
        if (targetDisplay) targetDisplay.innerText = this.rocketState.target;
        
        // Add decoys to the pool
        this.rocketPool = [this.rocketState.target];
        for (let i = 0; i < 5; i++) {
            this.rocketPool.push(letters[Math.floor(Math.random() * letters.length)]);
        }
    },

    startRocketLoop() {
        if (this.rocketLoop) cancelAnimationFrame(this.rocketLoop);
        
        const loop = (time) => {
            if (this.state.currentScreen !== 'game-rocket') {
                window.removeEventListener('mousemove', this._rocketMoveHandler);
                window.removeEventListener('touchmove', this._rocketMoveHandler);
                return;
            }
            if (!this.rocketState.active) return;

            // Progressive speed increase
            this.rocketState.multiplier += 0.0001; 
            this.updateRocketSpeedDisplay();
            
            this.rocketState.currentSpeed = this.rocketState.baseSpeed * this.rocketState.multiplier;

            // Spawn elements
            const spawnInterval = 1000 / this.rocketState.multiplier;
            if (time - this.rocketState.lastSpawn > spawnInterval) {
                this.spawnRocketElement();
                this.rocketState.lastSpawn = time;
            }

            // Move elements
            const rocket = document.getElementById('rocket-obj');
            const rocketRect = rocket.getBoundingClientRect();

            this.rocketState.elements = this.rocketState.elements.filter(el => {
                el.y += this.rocketState.currentSpeed;
                el.dom.style.top = `${el.y}px`;

                // Check collision
                const elRect = el.dom.getBoundingClientRect();
                const dist = Math.hypot(rocketRect.left + 40 - (elRect.left + 25), rocketRect.top + 40 - (elRect.top + 25));

                if (dist < 60) {
                    this.handleRocketCollect(el);
                    el.dom.remove();
                    return false;
                }

                if (el.y > window.innerHeight) {
                    el.dom.remove();
                    return false;
                }
                return true;
            });

            // Animate fire
            const fire = document.getElementById('rocket-fire');
            if (fire) {
                fire.style.transform = `translateX(-50%) scale(${0.8 + Math.random() * 0.4})`;
            }

            this.rocketLoop = requestAnimationFrame(loop);
        };

        this.rocketLoop = requestAnimationFrame(loop);
    },

    spawnRocketElement() {
        const char = this.rocketPool[Math.floor(Math.random() * this.rocketPool.length)];
        const el = document.createElement('div');
        el.className = 'rocket-fuel';
        el.style.cssText = `
            position: absolute;
            top: -60px;
            left: ${10 + Math.random() * 80}%;
            width: 60px;
            height: 60px;
            background: rgba(255,255,255,0.1);
            border: 3px solid ${char === this.rocketState.target ? '#F1C40F' : 'rgba(255,255,255,0.2)'};
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 2rem;
            font-weight: 900;
            box-shadow: 0 0 15px ${char === this.rocketState.target ? 'rgba(241, 196, 15, 0.5)' : 'transparent'};
        `;
        el.innerText = char;
        const container = document.getElementById('rocket-elements');
        if (container) {
            container.appendChild(el);
            this.rocketState.elements.push({ dom: el, y: -60, char });
        }
    },

    handleRocketCollect(el) {
        if (el.char === this.rocketState.target) {
            this.rocketState.progress = Math.min(100, this.rocketState.progress + 10);
            this.addScore(10);
            this.showToast('BRA BRÄNSLE! 🚀✨', 400);
            
            const rocket = document.getElementById('rocket-obj');
            if (rocket) {
                rocket.style.transform = `translateX(-50%) scale(1.3)`;
                setTimeout(() => { if (rocket) rocket.style.transform = `translateX(-50%) scale(1)`; }, 200);
            }

            this.updateRocketProgress();

            if (this.rocketState.progress >= 100) {
                this.winRocketGame();
            } else {
                this.nextRocketRound();
            }
        } else {
            // Lose fuel: -20%
            this.rocketState.progress = Math.max(0, this.rocketState.progress - 20);
            this.updateRocketProgress();
            
            const rocket = document.getElementById('rocket-obj');
            const fire = document.getElementById('rocket-fire');
            
            if (rocket) {
                rocket.style.animation = 'none';
                void rocket.offsetWidth; 
                rocket.style.animation = 'shake 0.5s';
                
                if (fire) {
                    const originalFire = fire.innerText;
                    fire.innerText = '💨';
                    setTimeout(() => {
                        if (fire) fire.innerText = originalFire;
                        if (rocket) rocket.style.animation = '';
                    }, 800);
                }
            }

            if (this.rocketState.progress <= 0) {
                this.gameOverRocket();
            } else {
                this.showToast('FEL BRÄNSLE! -20% 💨', 800);
            }
        }
    },

    updateRocketProgress() {
        const fill = document.getElementById('rocket-progress-fill');
        if (fill) fill.style.height = `${this.rocketState.progress}%`;
    },

    gameOverRocket() {
        this.rocketState.active = false;
        const overlay = document.getElementById('rocket-gameover');
        if (overlay) overlay.style.display = 'flex';
        
        const rocket = document.getElementById('rocket-obj');
        if (rocket) {
            rocket.style.transition = 'top 2s ease-in, transform 2s';
            rocket.style.top = '120%';
            rocket.style.transform = 'translateX(-50%) rotate(180deg)';
        }
    },

    winRocketGame() {
        this.rocketState.active = false;
        this.cheer('jump');
        this.showToast('VI NÅDDE MÅNEN! 🌙👨‍🚀', 3000);
        this.addScore(50);
        this.incrementProgress();
        
        const rocket = document.getElementById('rocket-obj');
        if (rocket) {
            rocket.style.transition = 'bottom 3s ease-in, opacity 3s';
            rocket.style.bottom = '120%';
            rocket.style.opacity = '0';
        }

        setTimeout(() => {
            this.showScreen('spel-menu');
        }, 4000);
    }
});
