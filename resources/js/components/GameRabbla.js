Object.assign(App.prototype, {
    initGameRabbla() {
        const div = this.screens['game-rabbla'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="rabbla-container" style="position: relative; width: 800px; height: 500px; margin: 0 auto; background: #1A202C; border-radius: 30px; overflow: hidden; border: 5px solid #2ECC71; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                
                <div style="position: absolute; top: 40px; text-align: center;">
                    <h2 style="color: #2ECC71; margin-bottom: 10px;">Bokstav-Rabbla 🗣️</h2>
                    <p style="color: #A0AEC0;">Säg bokstaven högt när den dyker upp!</p>
                </div>

                <div id="rabbla-lists" style="position: absolute; right: 20px; top: 20px; width: 180px; display: flex; flex-direction: column; gap: 8px; z-index: 10;">
                </div>

                <div id="rabbla-letter" style="font-size: 15rem; font-weight: bold; color: white; text-shadow: 0 0 30px rgba(46, 204, 113, 0.5); transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                    ?
                </div>

                <div id="rabbla-controls" style="position: absolute; bottom: 40px; display: flex; gap: 20px; align-items: center; justify-content: center; width: 100%;">
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <button style="width: 45px; height: 45px; padding: 0; font-size: 1.5rem; background: #2D3748; color: white; border: 2px solid #4A5568; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;" onclick="window.gameApp.changeRabblaSpeed(-200)" title="Snabbare">⬆️</button>
                        <button style="width: 45px; height: 45px; padding: 0; font-size: 1.5rem; background: #2D3748; color: white; border: 2px solid #4A5568; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;" onclick="window.gameApp.changeRabblaSpeed(200)" title="Långsammare">⬇️</button>
                    </div>
                    
                    <div style="background: rgba(0,0,0,0.5); padding: 15px 25px; border-radius: 15px; color: white; border: 2px solid #2ECC71; font-size: 1.2rem; font-weight: bold; display: flex; align-items: center;">
                        TAKT: <span id="rabbla-speed-text" style="margin-left: 5px;">1.8</span>s
                    </div>

                    <button id="rabbla-toggle" class="menu-card" style="width: auto; padding: 15px 30px; background: #E74C3C; border-color: #C0392B; margin: 0; font-size: 1.2rem;" onclick="window.gameApp.toggleRabbla()">Stoppa 🛑</button>
                    <button class="menu-card" style="width: auto; padding: 15px 30px; background: #718096; border-color: #4A5568; margin: 0; font-size: 1.2rem;" onclick="window.gameApp.showScreen('letter-menu')">Tillbaka 🏠</button>
                </div>

            </div>
        `;

        this.rabblaActive = true;
        this.rabblaSpeed = 1800;
        
        try {
            const saved = localStorage.getItem('rabblaLists');
            this.rabblaLists = saved ? JSON.parse(saved) : ["b, d, p", "m, n", "c, s, z"];
        } catch (e) {
            this.rabblaLists = ["b, d, p", "m, n", "c, s, z"];
        }
        
        this.activeRabblaListIndex = -1;
        this.editingRabblaListIndex = -1;
        this.updateRabblaLettersPool();
        
        // Keyboard support
        this._rabblaKeyHandler = (e) => {
            if (this.state.currentScreen !== 'game-rabbla') return;
            if (e.key === 'ArrowUp') this.changeRabblaSpeed(-200);
            if (e.key === 'ArrowDown') this.changeRabblaSpeed(200);
            if (e.key === ' ') this.toggleRabbla();
        };
        window.addEventListener('keydown', this._rabblaKeyHandler);
        
        this.startRabbla();
        this.renderRabblaLists();
    },

    startRabbla() {
        if (this.rabblaInterval) clearInterval(this.rabblaInterval);
        this.rabblaInterval = setInterval(() => {
            if (this.state.currentScreen !== 'game-rabbla') {
                clearInterval(this.rabblaInterval);
                window.removeEventListener('keydown', this._rabblaKeyHandler);
                return;
            }
            if (!this.rabblaActive) return;
            this.nextRabblaLetter();
        }, this.rabblaSpeed);
        
        this.nextRabblaLetter();
    },

    changeRabblaSpeed(delta) {
        this.rabblaSpeed = Math.max(200, Math.min(5000, this.rabblaSpeed + delta));
        const speedText = document.getElementById('rabbla-speed-text');
        if (speedText) speedText.innerText = (this.rabblaSpeed / 1000).toFixed(1);
        
        if (this.rabblaActive && this.state.currentScreen === 'game-rabbla') this.startRabbla();
    },

    nextRabblaLetter() {
        if (this.state.currentScreen !== 'game-rabbla') {
            if (this.rabblaInterval) clearInterval(this.rabblaInterval);
            window.removeEventListener('keydown', this._rabblaKeyHandler);
            return;
        }
        const letterEl = document.getElementById('rabbla-letter');
        if (!letterEl) return;
        
        const randomLetter = this.rabblaLetters[Math.floor(Math.random() * this.rabblaLetters.length)];
        letterEl.innerText = randomLetter;
        
        // Animation
        letterEl.style.transform = 'scale(0.8)';
        setTimeout(() => {
            letterEl.style.transform = 'scale(1.1)';
            setTimeout(() => {
                letterEl.style.transform = 'scale(1)';
            }, 100);
        }, 50);
        
        this.addScore(1);
    },

    renderRabblaLists() {
        const container = document.getElementById('rabbla-lists');
        if (!container) return;
        container.innerHTML = '<h3 style="color: white; margin: 0 0 5px 0; font-size: 1rem; text-align: center;">Fokus (5x) Dbl-klick:</h3>';
        
        this.rabblaLists.forEach((listStr, idx) => {
            const isActive = this.activeRabblaListIndex === idx;
            const isEditing = this.editingRabblaListIndex === idx;
            
            const item = document.createElement('div');
            item.style.cssText = `
                background: ${isActive ? '#2ECC71' : '#2D3748'};
                color: ${isActive ? '#1A202C' : 'white'};
                padding: 10px;
                border-radius: 8px;
                border: 2px solid ${isActive ? '#27AE60' : '#4A5568'};
                cursor: pointer;
                font-weight: bold;
                text-align: center;
                user-select: none;
                transition: all 0.2s;
            `;
            
            if (isEditing) {
                const input = document.createElement('input');
                input.value = listStr;
                input.style.cssText = "width: 100%; padding: 5px; box-sizing: border-box; background: white; color: black; border: none; border-radius: 4px; font-weight: bold; text-align: center;";
                input.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        this.rabblaLists[idx] = input.value;
                        localStorage.setItem('rabblaLists', JSON.stringify(this.rabblaLists));
                        this.editingRabblaListIndex = -1;
                        this.updateRabblaLettersPool();
                        this.renderRabblaLists();
                    }
                };
                input.onblur = () => {
                    this.rabblaLists[idx] = input.value;
                    localStorage.setItem('rabblaLists', JSON.stringify(this.rabblaLists));
                    this.editingRabblaListIndex = -1;
                    this.updateRabblaLettersPool();
                    this.renderRabblaLists();
                };
                item.appendChild(input);
                setTimeout(() => input.focus(), 10);
            } else {
                item.innerText = listStr || '(tom)';
                item.onclick = () => {
                    this.activeRabblaListIndex = isActive ? -1 : idx;
                    this.updateRabblaLettersPool();
                    this.renderRabblaLists();
                };
                item.ondblclick = () => {
                    this.editingRabblaListIndex = idx;
                    this.renderRabblaLists();
                };
            }
            container.appendChild(item);
        });
    },

    updateRabblaLettersPool() {
        const base = "abcdefghijklmnopqrstuvwxyzåäö".split("");
        let pool = [...base];
        
        if (this.activeRabblaListIndex !== -1) {
            const listStr = this.rabblaLists[this.activeRabblaListIndex];
            const focusedLetters = listStr.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length === 1 && base.includes(s));
            
            focusedLetters.forEach(char => {
                for(let i = 0; i < 4; i++) {
                    pool.push(char);
                }
            });
        }
        
        this.rabblaLetters = pool;
    },

    toggleRabbla() {
        this.rabblaActive = !this.rabblaActive;
        const btn = document.getElementById('rabbla-toggle');
        if (btn) {
            btn.innerText = this.rabblaActive ? 'Stoppa 🛑' : 'Starta ▶️';
            btn.style.background = this.rabblaActive ? '#E74C3C' : '#2ECC71';
            btn.style.borderColor = this.rabblaActive ? '#C0392B' : '#27AE60';
        }
    }
});
