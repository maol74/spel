Object.assign(App.prototype, {
    initGameLjuda() {
        const div = this.screens['game-ljuda'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="ljuda-container" style="position: relative; width: 800px; height: 500px; margin: 0 auto; background: #1A202C; border-radius: 30px; overflow: hidden; border: 5px solid #3498DB; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                
                <div style="position: absolute; top: 40px; text-align: center;">
                    <h2 style="color: #3498DB; margin-bottom: 10px;">Ljuda ord 🗣️</h2>
                    <p style="color: #A0AEC0;">Läs ordet och säg det högt!</p>
                </div>

                <div id="ljuda-word" style="font-size: 8rem; font-weight: bold; color: white; text-shadow: 0 0 20px rgba(52, 152, 219, 0.4); letter-spacing: 10px;">
                    Ord
                </div>

                <div id="ljuda-controls" style="position: absolute; bottom: 40px; display: flex; gap: 20px;">
                    <button class="menu-card" style="width: auto; padding: 10px 60px; background: #2ECC71; border-color: #27AE60; font-size: 1.5rem;" onclick="window.gameApp.nextLjudaWord()">Nästa ord ➡️</button>
                    <button class="menu-card" style="width: auto; padding: 10px 40px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('word-menu')">Tillbaka 🏠</button>
                </div>

            </div>
        `;

        this.ljudaWordsRaw = [
            'Sol', 'Is', 'Bo', 'Bil', 'Ko', 'Löv', 'Tåg', 'Hund', 'Katt', 'Apa', 'Tå', 'Öga', 'Mun', 'Bok', 'Sko', 
            'Mat', 'Mor', 'Far', 'Bror', 'Syster', 'Hus', 'Tv', 'Snö', 'Regn', 'Vind', 'Gräs', 'Blomma',
            'Röd', 'Blå', 'Gul', 'Grön', 'Hej', 'Bra', 'Glad', 'Leker', 'Hoppar', 'Springa'
        ];
        
        this.ljudaRemaining = [];
        
        // Keyboard support
        this._ljudaKeyHandler = (e) => {
            if (this.state.currentScreen !== 'game-ljuda') return;
            if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') this.nextLjudaWord();
        };
        window.addEventListener('keydown', this._ljudaKeyHandler);
        
        this.nextLjudaWord();
    },

    nextLjudaWord() {
        const wordEl = document.getElementById('ljuda-word');
        if (!wordEl) {
            window.removeEventListener('keydown', this._ljudaKeyHandler);
            return;
        }

        // Fill and shuffle if empty
        if (this.ljudaRemaining.length === 0) {
            this.ljudaRemaining = [...this.ljudaWordsRaw].sort(() => Math.random() - 0.5);
            // If the first word of the new shuffle is the same as the last word shown, swap it
            if (this.ljudaLastWord && this.ljudaRemaining[0] === this.ljudaLastWord && this.ljudaRemaining.length > 1) {
                const temp = this.ljudaRemaining[0];
                this.ljudaRemaining[0] = this.ljudaRemaining[1];
                this.ljudaRemaining[1] = temp;
            }
        }
        
        const nextWord = this.ljudaRemaining.pop();
        this.ljudaLastWord = nextWord;
        wordEl.innerText = nextWord;
        
        // Simple pop animation
        wordEl.style.transform = 'scale(0.9)';
        wordEl.style.opacity = '0';
        setTimeout(() => {
            wordEl.style.transform = 'scale(1)';
            wordEl.style.opacity = '1';
        }, 50);

        this.addScore(1);
    }
});
