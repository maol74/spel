Object.assign(App.prototype, {
    initAdventureGame() {
        const div = this.screens['game-adventure'];
        div.innerHTML = `
            ${this.getHUD()}
            <div style="display: flex; align-items: center; justify-content: center; gap: 30px; margin-top: 20px;">
                <!-- SKJUT - LEFT -->
                <button class="btn btn-skjut" 
                        style="width: 120px; height: 120px; border-radius: 50%; font-size: 1.5rem; background: #E74C3C; box-shadow: 0 10px 0 #C0392B; transition: all 0.1s;" 
                        onmousedown="window.gameApp.handleShoot()" ontouchstart="event.preventDefault(); window.gameApp.handleShoot()">SKJUT! 🔥</button>

                <!-- GAME FRAME -->
                <div style="position: relative; width: 800px; height: 400px; background: #87CEEB; border-radius: 20px; overflow: hidden; border: 5px solid #2D3748; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                    <canvas id="adventure-canvas" width="800" height="400" style="width:100%; height:100%;"></canvas>
                    
                    <div id="adv-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white;">
                        <h1 id="adv-status-text" style="font-size: 3rem; margin-bottom: 20px;">GAME OVER</h1>
                        <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.5rem;" onclick="window.gameApp.initAdventureGame()">Spela Igen! 🔄</button>
                        <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till menyn 🏠</button>
                    </div>

                    <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end;">
                        <div id="adv-lives" style="background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 1.2rem; letter-spacing: 5px;">
                            ❤️❤️❤️
                        </div>
                        <div style="background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 0.9rem;">
                            FART: <span id="adv-speed">0.0</span>
                        </div>
                        <div style="background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold;">
                            POÄNG: <span id="adv-score">0</span> / ${this.config.adventure.targetScore}
                        </div>
                    </div>
                </div>

                <!-- HOPPA - RIGHT -->
                <button class="btn btn-hoppa" 
                        style="width: 120px; height: 120px; border-radius: 50%; font-size: 1.5rem; background: #2ECC71; box-shadow: 0 10px 0 #27AE60; transition: all 0.1s;" 
                        onmousedown="window.gameApp.handleJump()" ontouchstart="event.preventDefault(); window.gameApp.handleJump()">HOPPA! ⬆️</button>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #718096; font-weight: bold;">
                Hoppa: Pil Upp | Skjut: Space
            </div>
        `;
        // Stop any previous loop
        if (this.adventureLoopId) {
            cancelAnimationFrame(this.adventureLoopId);
        }
        this.adventureGameActive = true;
        this.startAdventureLoop();
    },

    handleJump() { 
        if (this.adventurePlayer && !this.adventurePlayer.jumping && this.adventureGameActive) { 
            // Hero Power: Superhopp (Level 5+)
            const jumpPower = this.state.level >= 5 ? -18 : -15;
            this.adventurePlayer.dy = jumpPower; 
            this.adventurePlayer.jumping = true; 
            if (this.state.level >= 5) this.showToast('SUPERHOPP! 🚀');
        } 
    },

    handleShoot() {
        if (this.state.currentScreen === 'game-adventure' && this.adventureProjectiles && this.adventureGameActive) {
            // Hero Power: Trippelskott (Level 10+)
            if (this.state.level >= 10) {
                this.adventureProjectiles.push({ x: this.adventurePlayer.x + 40, y: this.adventurePlayer.y + 10, w: 20, h: 8 });
                this.adventureProjectiles.push({ x: this.adventurePlayer.x + 40, y: this.adventurePlayer.y + 20, w: 20, h: 8 });
                this.adventureProjectiles.push({ x: this.adventurePlayer.x + 40, y: this.adventurePlayer.y + 30, w: 20, h: 8 });
                this.showToast('TRIPPELSKOTT! 🔥🔥🔥');
            } else {
                this.adventureProjectiles.push({ x: this.adventurePlayer.x + 40, y: this.adventurePlayer.y + 20, w: 20, h: 8 });
            }
        }
    },

    updateAdventureLivesDisplay() {
        const livesEl = document.getElementById('adv-lives');
        if (livesEl) {
            livesEl.innerText = '❤️'.repeat(this.adventureLives);
        }
    },

    showAdventureEnd(won) {
        this.adventureGameActive = false;
        const overlay = document.getElementById('adv-overlay');
        const statusText = document.getElementById('adv-status-text');
        if (overlay && statusText) {
            overlay.classList.remove('hidden');
            statusText.innerText = won ? 'DU VANN! 🎉🏆' : 'GAME OVER! 👻';
            statusText.style.color = won ? '#F1C40F' : '#E74C3C';
        }
        if (won) {
            this.addScore(2);
            this.incrementProgress();
        }
    },

    startAdventureLoop() {
        const canvas = document.getElementById('adventure-canvas'); 
        if (!canvas) return;
        const ctx = canvas.getContext('2d'); 
        const hud = document.getElementById('adv-score');
        const speedHud = document.getElementById('adv-speed');
        
        this.adventureLives = 3;
        this.adventureInvulnerable = 0; // Frames of invulnerability
        this.adventurePlayer = { x: 50, y: 300, w: 40, h: 40, dy: 0, jumping: false, falling: false }; 
        this.adventureProjectiles = [];
        let obstacles = []; 
        let frame = 0; 
        let score = 0; 

        const loop = () => {
            if (!this.adventureGameActive || this.state.currentScreen !== 'game-adventure') {
                return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            ctx.fillStyle = '#27AE60'; 
            ctx.fillRect(0, 340, canvas.width, 60);

            if (this.adventureInvulnerable > 0) this.adventureInvulnerable--;

            const baseSpeed = this.config.adventure.baseSpeed + (this.state.difficulty * 1.5);
            const timeBonus = frame / 500;
            const speed = Math.min(baseSpeed + timeBonus, 20);
            if (speedHud && frame % 10 === 0) speedHud.innerText = speed.toFixed(1);
            const spawnRate = Math.max(30, 100 - (this.state.difficulty * 10) - Math.floor(frame / (600 / (this.config.adventure.spawnRate * 50))));

            const animalEmojis = ['🦁', '🐯', '🐘', '🦒', '🦓', '🦍', '🐊'];
            const birdEmojis = ['👾', '🛸', '🦅', '🦇'];
            
            if (frame % spawnRate === 0) {
                const rand = Math.random();
                if (rand < 0.1) {
                    obstacles.push({ x: 800, y: 150 + Math.random() * 150, w: 45, h: 45, type: 'treasure', icon: '💎', size: 45 });
                } else if (rand < 0.25) { // 15% chance for stars
                    obstacles.push({ x: 800, y: 150 + Math.random() * 150, w: 40, h: 40, type: 'star', icon: '⭐', size: 40 });
                } else if (rand < 0.45) {
                    const size = 30 + Math.random() * 50;
                    obstacles.push({ x: 800, y: 340 - size, w: size, h: size, type: 'animal', icon: animalEmojis[Math.floor(Math.random() * animalEmojis.length)], size: size });
                } else if (rand < 0.6) {
                    obstacles.push({ x: 800, y: 340, w: 80, h: 60, type: 'pit', icon: '🕳️', size: 40 });
                } else if (rand < 0.75) {
                    const size = 30 + Math.random() * 40;
                    obstacles.push({ x: 800, y: 120 + Math.random() * 100, w: size, h: size, type: 'bird', icon: birdEmojis[Math.floor(Math.random() * birdEmojis.length)], size: size });
                } else if (rand < 0.8) {
                    obstacles.push({ x: 800, y: 150 + Math.random() * 100, w: 40, h: 40, type: 'heart', icon: '❤️', size: 40 });
                } else {
                    const size = 30 + Math.random() * 40;
                    obstacles.push({ x: 800, y: 340 - size, w: size, h: size, type: 'box', icon: '📦', size: size });
                }
            }

            for (let i = obstacles.length - 1; i >= 0; i--) {
                const o = obstacles[i];
                o.x -= speed;
                
                if (o.type === 'pit') {
                    ctx.fillStyle = '#141D21';
                    ctx.fillRect(o.x, 340, o.w, 60);
                } else {
                    ctx.font = `${o.size}px Arial`;
                    ctx.fillText(o.icon, o.x, o.y + o.size - 5);
                }

                let destroyed = false;
                this.adventureProjectiles.forEach((proj, pi) => {
                    if ((o.type === 'animal' || o.type === 'bird') && 
                        proj.x < o.x + o.w && proj.x + proj.w > o.x && proj.y < o.y + o.h && proj.y + proj.h > o.y) {
                        obstacles.splice(i, 1);
                        this.adventureProjectiles.splice(pi, 1);
                        score += 10;
                        if (hud) hud.innerText = score;
                        destroyed = true;
                        if (score >= this.config.adventure.targetScore) {
                            this.showAdventureEnd(true);
                        }
                    }
                });

                if (destroyed) continue;

                const p = this.adventurePlayer;
                if (!p.falling) {
                    let hit = false;
                    if (o.type === 'pit') {
                        if (p.x + p.w - 15 > o.x && p.x + 15 < o.x + o.w && p.y >= 300) {
                            if (this.adventureInvulnerable === 0) {
                                p.falling = true;
                            }
                            continue;
                        }
                    } else if (p.x < o.x + o.w - 10 && p.x + p.w - 10 > o.x && p.y < o.y + o.h - 10 && p.y + p.h - 10 > o.y) {
                        if (o.type === 'treasure') {
                            score += 15;
                            if (hud) hud.innerText = score;
                            obstacles.splice(i, 1);
                            continue;
                        }
                        if (o.type === 'star') {
                            score += 10;
                            if (hud) hud.innerText = score;
                            this.addScore(1);
                            this.showToast('STJÄRNA! ⭐+1');
                            obstacles.splice(i, 1);
                            continue;
                        }
                        if (o.type === 'heart') {
                            if (this.adventureLives < 5) {
                                this.adventureLives++;
                                this.updateAdventureLivesDisplay();
                                this.showToast('EXTRALIV! ❤️');
                            } else {
                                score += 20;
                                if (hud) hud.innerText = score;
                                this.showToast('SUPERBONUS! 💎');
                            }
                            obstacles.splice(i, 1);
                            continue;
                        }
                        if (this.adventureInvulnerable === 0) {
                            hit = true;
                        }
                    }

                    if (hit) {
                        this.adventureLives--;
                        this.updateAdventureLivesDisplay();
                        if (this.adventureLives > 0) {
                            this.showToast('Hoppsan! Förlorade ett liv ❤️');
                            this.adventureInvulnerable = 120; // ~2 seconds invulnerability
                            obstacles = obstacles.filter(obs => obs.x > 300 || obs.type === 'treasure');
                        } else {
                            this.showAdventureEnd(false);
                            return;
                        }
                    }
                    
                    if (!o.passed && o.x < p.x && !['treasure', 'star', 'heart'].includes(o.type)) {
                        o.passed = true;
                        score += 5;
                        if (hud) hud.innerText = score;
                        if (score >= this.config.adventure.targetScore) {
                            this.showAdventureEnd(true);
                            return;
                        }
                    }
                }
                if (o.x < -100) obstacles.splice(i, 1);
            }

            this.adventureProjectiles.forEach((p, pi) => {
                p.x += 12; ctx.fillStyle = '#FF0000'; ctx.fillRect(p.x, p.y, p.w, p.h); 
                ctx.shadowBlur = 10; ctx.shadowColor = 'red';
                if (p.x > 800) this.adventureProjectiles.splice(pi, 1);
                ctx.shadowBlur = 0;
            });

            this.adventurePlayer.dy += this.config.adventure.gravity; 
            this.adventurePlayer.y += this.adventurePlayer.dy;
            
            if (!this.adventurePlayer.falling) {
                if (this.adventurePlayer.y > 300) { 
                    this.adventurePlayer.y = 300; 
                    this.adventurePlayer.dy = 0; 
                    this.adventurePlayer.jumping = false; 
                }
            } else if (this.adventurePlayer.y > 450) {
                this.adventureLives--;
                this.updateAdventureLivesDisplay();
                if (this.adventureLives > 0) {
                    this.showToast('Hoppsan! Du trillade ner! ❤️');
                    this.adventureInvulnerable = 120;
                    this.adventurePlayer.y = 300;
                    this.adventurePlayer.dy = 0;
                    this.adventurePlayer.falling = false;
                    this.adventurePlayer.jumping = false;
                    obstacles = obstacles.filter(obs => obs.x > 300 || obs.type === 'treasure');
                } else {
                    this.showAdventureEnd(false);
                    return;
                }
            }
            
            if (this.adventureInvulnerable % 10 < 5) {
                ctx.font = '45px Arial'; 
                ctx.fillText(this.state.avatar?.icon || '🥷', this.adventurePlayer.x, this.adventurePlayer.y + 35);
            }

            frame++; 
            this.adventureLoopId = requestAnimationFrame(loop);
        };
        this.adventureLoopId = requestAnimationFrame(loop);
        window.onkeydown = (e) => { 
            if (e.code === 'ArrowUp') this.handleJump(); 
            if (e.code === 'Space') this.handleShoot(); 
        };
    }
});
