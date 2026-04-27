Object.assign(App.prototype, {
    initGameRace() {
        const div = this.screens['game-race'];
        div.innerHTML = `
            ${this.getHUD()}
            <div style="display: flex; align-items: flex-end; justify-content: center; gap: 20px; width: 100%; max-width: 900px; margin: 0 auto; padding-top: 20px; padding-bottom: 20px;">
                <button class="menu-card" style="width: 120px; height: 120px; border-radius: 50%; font-size: 3rem; display: flex; justify-content: center; align-items: center; margin: 0; margin-bottom: 30px;" onmousedown="window.gameApp.moveRacePlayer(-40)" ontouchstart="event.preventDefault(); window.gameApp.moveRacePlayer(-40)">⬅️</button>

                <div id="race-container" style="position: relative; width: 400px; height: 600px; background: #333; border: 10px solid #555; border-radius: 20px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                    <div class="road-lines" style="position: absolute; width: 100%; height: 200%; top: -100%; background: repeating-linear-gradient(to bottom, transparent, transparent 50px, rgba(255,255,255,0.2) 50px, rgba(255,255,255,0.2) 100px); animation: roadScroll 0.5s linear infinite;"></div>
                    
                    <div id="race-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white;">
                        <h1 id="race-status-text" style="font-size: 2.5rem; margin-bottom: 20px; text-align: center;">GAME OVER</h1>
                        <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.2rem;" onclick="window.gameApp.initGameRace()">Spela Igen! 🔄</button>
                        <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('spel-menu')">Tillbaka till menyn 🏠</button>
                    </div>

                    <div id="race-lives" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 1.2rem; z-index: 20; letter-spacing: 5px; border: 2px solid #E74C3C;">
                        ❤️❤️❤️
                    </div>

                    <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; z-index: 20;">
                        <div style="background: rgba(0,0,0,0.7); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 0.9rem; border: 2px solid #3498DB;">
                            FART: <span id="race-speed">0.0</span>
                        </div>
                        <div id="race-timer" style="background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 1.2rem; font-family: monospace; border: 2px solid #4A90E2;">
                            TID: <span id="race-time">30</span>s
                        </div>
                    </div>

                    <div id="player-car" style="position: absolute; bottom: 50px; left: 175px; width: 50px; height: 90px; background: #E74C3C; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); border: 2px solid #C0392B; z-index: 15; transition: left 0.1s ease-out;">
                        <div style="position: absolute; top: 15px; left: 5px; right: 5px; height: 25px; background: #222; border-radius: 5px 5px 0 0; opacity: 0.8;"></div>
                        <div style="position: absolute; bottom: 10px; left: 5px; right: 5px; height: 15px; background: #222; border-radius: 0 0 5px 5px; opacity: 0.8;"></div>
                        <div style="position: absolute; top: -5px; left: 10px; width: 10px; height: 10px; background: #F1C40F; border-radius: 50%; box-shadow: 0 0 10px #F1C40F;"></div>
                        <div style="position: absolute; top: -5px; right: 10px; width: 10px; height: 10px; background: #F1C40F; border-radius: 50%; box-shadow: 0 0 10px #F1C40F;"></div>
                    </div>
                    <div id="race-area" style="width: 100%; height: 100%;"></div>
                </div>

                <button class="menu-card" style="width: 120px; height: 120px; border-radius: 50%; font-size: 3rem; display: flex; justify-content: center; align-items: center; margin: 0; margin-bottom: 30px;" onmousedown="window.gameApp.moveRacePlayer(40)" ontouchstart="event.preventDefault(); window.gameApp.moveRacePlayer(40)">➡️</button>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #CBD5E0; font-weight: bold;">Använd pilarna eller piltangenterna för att köra! 🏎️💨</div>
            <style>
                @keyframes roadScroll {
                    from { transform: translateY(0); }
                    to { transform: translateY(100px); }
                }
            </style>
        `;
        
        this.raceActive = true;
        this.raceLives = 3;
        this.raceInvulnerable = 0;
        this.raceTimeLeft = 30;
        this.playerX = 175;
        
        const speedHud = document.getElementById('race-speed');

        if (this.raceTimerInterval) clearInterval(this.raceTimerInterval);
        this.raceTimerInterval = setInterval(() => {
            if (!this.raceActive) return;
            this.raceTimeLeft--;
            const timeEl = document.getElementById('race-time');
            if (timeEl) timeEl.innerText = this.raceTimeLeft;
            
            const currentSpeed = 4.0 + (this.state.difficulty * 1.5) + ((30 - this.raceTimeLeft) * 0.2);
            if (speedHud) speedHud.innerText = currentSpeed.toFixed(1);

            if (this.raceTimeLeft <= 0) {
                this.showRaceEnd(true);
            }
        }, 1000);

        if (this.raceSpawnLoop) clearInterval(this.raceSpawnLoop);
        this.raceSpawnLoop = setInterval(() => this.spawnTraffic(), 1000 - (this.state.difficulty * 100));

        window.onkeydown = (e) => {
            if (!this.raceActive || this.state.currentScreen !== 'game-race') return;
            if (e.key === 'ArrowLeft') this.moveRacePlayer(-40);
            if (e.key === 'ArrowRight') this.moveRacePlayer(40);
        };
    },

    updateRaceLivesDisplay() {
        const livesEl = document.getElementById('race-lives');
        if (livesEl) {
            livesEl.innerText = '❤️'.repeat(this.raceLives);
        }
    },

    showRaceEnd(won) {
        this.raceActive = false;
        if (this.raceTimerInterval) clearInterval(this.raceTimerInterval);
        if (this.raceSpawnLoop) clearInterval(this.raceSpawnLoop);
        
        const overlay = document.getElementById('race-overlay');
        const statusText = document.getElementById('race-status-text');
        if (overlay && statusText) {
            overlay.classList.remove('hidden');
            statusText.innerText = won ? 'MÅLGÅNG! 🏁\nGrymt kört! 🏆' : 'KROCK! 💥\nSlut på bilar!';
            statusText.style.color = won ? '#F1C40F' : '#E74C3C';
        }
        if (won) {
            this.addScore(2);
            this.incrementProgress();
        }
    },

    moveRacePlayer(delta) {
        if (!this.raceActive) return;
        const newX = this.playerX + delta;
        if (newX >= 25 && newX <= 325) {
            this.playerX = newX;
            const player = document.getElementById('player-car');
            if (player) player.style.left = this.playerX + 'px';
        }
    },

    spawnTraffic() {
        const area = document.getElementById('race-area');
        if (!area) return;
        
        const rand = Math.random();
        const isHeart = rand < 0.08;
        const isStar = !isHeart && rand < 0.25;
        const colors = ['#3498DB', '#2ECC71', '#F1C40F', '#9B59B6', '#E67E22'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const t = document.createElement('div');
        t.style.cssText = `
            position: absolute;
            top: -120px;
            left: ${25 + Math.random() * 300}px;
            width: 50px;
            height: ${(isHeart || isStar) ? '50px' : '90px'};
            background: ${(isHeart || isStar) ? 'transparent' : color};
            border-radius: 10px;
            border: ${(isHeart || isStar) ? 'none' : '2px solid rgba(0,0,0,0.3)'};
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: ${(isHeart || isStar) ? '2.5rem' : '1rem'};
        `;
        
        if (isHeart) {
            t.innerText = '❤️';
            t.dataset.type = 'heart';
        } else if (isStar) {
            t.innerText = '⭐';
            t.dataset.type = 'star';
            t.style.filter = 'drop-shadow(0 0 10px #F1C40F)';
        } else {
            const glass = document.createElement('div');
            glass.style.cssText = `position: absolute; top: 15%; left: 5px; right: 5px; height: 25px; background: rgba(0,0,0,0.5); border-radius: 5px;`;
            t.appendChild(glass);
        }
        
        area.appendChild(t);
        
        const speed = 4 + Math.random() * 3 + (this.state.difficulty * 1.5) + ((30 - this.raceTimeLeft) * 0.2);
        let pos = -120;
        
        const move = () => {
            if (!this.raceActive || !t.parentNode || this.state.currentScreen !== 'game-race') {
                if (t.parentNode) t.remove();
                return;
            }
            pos += speed;
            t.style.top = pos + 'px';
            
            if (this.raceInvulnerable > 0) {
                this.raceInvulnerable--;
                const player = document.getElementById('player-car');
                if (player) player.style.opacity = (Math.floor(Date.now() / 100) % 2 === 0) ? '0.5' : '1';
            } else {
                const player = document.getElementById('player-car');
                if (player) player.style.opacity = '1';
                
                const tRect = t.getBoundingClientRect();
                const pRect = player ? player.getBoundingClientRect() : null;
                
                if (pRect && tRect.bottom > pRect.top + 10 && tRect.top < pRect.bottom - 10 && 
                    tRect.right > pRect.left + 5 && tRect.left < pRect.right - 5) {
                    if (t.dataset.type === 'heart') {
                        if (this.raceLives < 5) {
                            this.raceLives++;
                            this.updateRaceLivesDisplay();
                            this.showToast('EXTRALIV! ❤️');
                        } else {
                            this.raceTimeLeft += 5;
                            this.showToast('BONUSTID! ⏱️');
                        }
                    } else if (t.dataset.type === 'star') {
                        this.addScore(1);
                        this.showToast('STJÄRNA! ⭐+1');
                    } else {
                        this.handleRaceCrash();
                    }
                    t.remove();
                    return;
                }
            }
            
            if (pos > 700) {
                t.remove();
            } else {
                requestAnimationFrame(move);
            }
        };
        requestAnimationFrame(move);
    },

    handleRaceCrash() {
        this.raceLives--;
        this.updateRaceLivesDisplay();
        
        if (this.raceLives <= 0) {
            this.showRaceEnd(false);
        } else {
            this.showToast('KROCK! 💥');
            this.raceInvulnerable = 120;
        }
    }
});
