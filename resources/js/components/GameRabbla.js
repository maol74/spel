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
        this.rabblaLetters = "abcdefghijklmnopqrstuvwxyzåäö".split("");
        
        // Keyboard support
        this._rabblaKeyHandler = (e) => {
            if (this.state.currentScreen !== 'game-rabbla') return;
            if (e.key === 'ArrowUp') this.changeRabblaSpeed(-200);
            if (e.key === 'ArrowDown') this.changeRabblaSpeed(200);
            if (e.key === ' ') this.toggleRabbla();
        };
        window.addEventListener('keydown', this._rabblaKeyHandler);
        
        this.startRabbla();
    },

    startRabbla() {
        if (this.rabblaInterval) clearInterval(this.rabblaInterval);
        this.rabblaInterval = setInterval(() => {
            if (!this.rabblaActive) return;
            this.nextRabblaLetter();
        }, this.rabblaSpeed);
        
        this.nextRabblaLetter();
    },

    changeRabblaSpeed(delta) {
        this.rabblaSpeed = Math.max(200, Math.min(5000, this.rabblaSpeed + delta));
        const speedText = document.getElementById('rabbla-speed-text');
        if (speedText) speedText.innerText = (this.rabblaSpeed / 1000).toFixed(1);
        
        if (this.rabblaActive) this.startRabbla();
    },

    nextRabblaLetter() {
        const letterEl = document.getElementById('rabbla-letter');
        if (!letterEl) {
            // Clean up if element is gone
            if (this.rabblaInterval) clearInterval(this.rabblaInterval);
            window.removeEventListener('keydown', this._rabblaKeyHandler);
            return;
        }
        
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
