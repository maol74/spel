Object.assign(App.prototype, {
    initGameWhack() {
        const div = this.screens['game-whack'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="whack-container" style="position: relative; width: 600px; height: 500px; margin: 40px auto; background: #7CB342; border-radius: 30px; padding: 40px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); border: 8px solid #558B2F; cursor: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"48\" height=\"48\" style=\"font-size:32px\"><text y=\"32\">🔨</text></svg>') 16 16, pointer;">
                
                <div id="whack-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white; cursor: default;">
                    <h1 id="whack-status-text" style="font-size: 3rem; margin-bottom: 20px;">GAME OVER</h1>
                    <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.5rem;" onclick="window.gameApp.initGameWhack()">Spela Igen! 🔄</button>
                    <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('spel-menu')">Tillbaka till menyn 🏠</button>
                </div>

                <div id="whack-lives" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 1.2rem; z-index: 10; letter-spacing: 5px; border: 2px solid #E74C3C;">
                    ❤️❤️❤️
                </div>

                <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; z-index: 10;">
                    <div style="background: rgba(0,0,0,0.5); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 0.9rem; border: 2px solid #3498DB;">
                        FART: <span id="whack-speed">0.0</span>
                    </div>
                    <div id="whack-score" style="background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 1.2rem; border: 2px solid #F1C40F; backdrop-filter: blur(5px);">
                        POFFADE: <span id="whack-count">0</span> / 20
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%; height: 100%;">
                    ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `
                        <div id="hole-${i}" class="whack-hole" style="position: relative; background: #3E2723; border-radius: 50%; height: 120px; width: 120px; box-shadow: inset 0 10px 20px rgba(0,0,0,0.6); overflow: hidden; border: 4px solid #5D4037; margin: auto;">
                            <div class="monster" style="position: absolute; bottom: -100%; left: 10%; width: 80%; height: 80%; font-size: 4rem; display: flex; justify-content: center; align-items: center; transition: bottom 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); user-select: none;">👾</div>
                        </div>
                    `).join('')}
                </div>
                <div style="position: absolute; bottom: 20px; left: 20px; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.3); font-weight: bold;">
                    Klicka på monstren när de tittar upp! 🔨👾
                </div>
            </div>
        `;
        
        this.whackCount = 0;
        this.whackLives = 3;
        this.whackActive = true;
        
        if (this.whackLoop) clearTimeout(this.whackLoop);
        this.startWhacking();
    },

    updateWhackLivesDisplay() {
        const livesEl = document.getElementById('whack-lives');
        if (livesEl) {
            livesEl.innerText = '❤️'.repeat(this.whackLives);
        }
    },

    showWhackEnd(won) {
        this.whackActive = false;
        if (this.whackLoop) clearTimeout(this.whackLoop);
        
        const overlay = document.getElementById('whack-overlay');
        const statusText = document.getElementById('whack-status-text');
        if (overlay && statusText) {
            overlay.classList.remove('hidden');
            statusText.innerText = won ? 'POFF! 🎉🔨\nGrymt jobbat! 🏆' : 'MONSTER-KAOS! 👾👻';
            statusText.style.color = won ? '#F1C40F' : '#E74C3C';
        }
        if (won) {
            this.state.score += 60;
            this.incrementProgress();
            this.saveState();
        }
    },

    startWhacking() {
        if (!this.whackActive || this.state.currentScreen !== 'game-whack') return;
        
        const holes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        const randomHole = holes[Math.floor(Math.random() * holes.length)];
        const holeEl = document.getElementById(`hole-${randomHole}`);
        if (!holeEl) return;
        
        const monster = holeEl.querySelector('.monster');
        if (!monster) return;
        
        const monsters = ['👾', '👽', '👹', '👻', '👺', '🤖'];
        monster.innerText = monsters[Math.floor(Math.random() * monsters.length)];
        
        const currentSpeed = 1.0 + (this.state.difficulty * 0.5) + (this.whackCount * 0.1);
        const speedHud = document.getElementById('whack-speed');
        if (speedHud) speedHud.innerText = currentSpeed.toFixed(1);

        monster.style.bottom = '10%';
        
        let clicked = false;
        monster.onclick = (e) => {
            if (clicked) return;
            clicked = true;
            e.stopPropagation();
            this.handleWhack(monster);
        };
        
        const upTime = (1000 / currentSpeed) + (Math.random() * 400);
        setTimeout(() => {
            if (!clicked && this.whackActive) {
                // Missed one!
                this.whackLives--;
                this.updateWhackLivesDisplay();
                if (this.whackLives <= 0) {
                    this.showWhackEnd(false);
                } else {
                    this.showToast('Hoppsan! Du missade! ❤️');
                }
            }
            monster.style.bottom = '-100%';
            monster.onclick = null;
            if (!this.whackActive) return;
            this.whackLoop = setTimeout(() => this.startWhacking(), 400 + Math.random() * 800);
        }, upTime);
    },

    handleWhack(monster) {
        monster.style.bottom = '-100%';
        this.whackCount++;
        const countEl = document.getElementById('whack-count');
        if (countEl) countEl.innerText = this.whackCount;
        
        const rect = monster.getBoundingClientRect();
        const effect = document.createElement('div');
        effect.innerText = '💥';
        effect.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            pointer-events: none;
            z-index: 100;
            animation: popOut 0.3s ease-out forwards;
        `;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 300);
        
        if (this.whackCount >= 20) {
            this.showWhackEnd(true);
        }
    }
});
