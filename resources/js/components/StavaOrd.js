Object.assign(App.prototype, {
    renderStava() {
        const div = this.screens['game-stava'];
        const levelWords = CONFIG.difficultyWords[this.state.difficulty] || CONFIG.difficultyWords[1];
        
        if (!this.currentWord) { 
            this.currentWord = levelWords[Math.floor(Math.random() * levelWords.length)]; 
            this.currentGuessedCount = 0;
            this.currentWordPool = this.generateWordPool(this.currentWord);
        }
        
        const emoji = CONFIG.wordEmojis[this.currentWord] || '✏️';
        
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card">
                <h2 style="color: #4A90E2; margin-bottom: 10px;">${this.state.user?.name}, stava:</h2>
                <div style="font-size: 6rem; margin-bottom: 2rem;">${emoji}</div>
                <div id="word-display" style="font-size: 3rem; letter-spacing: 15px; margin-bottom: 2rem; color: #4A5568;">
                    ${this.currentWord.split('').map((l, i) => i < this.currentGuessedCount ? `<span style="color:var(--color-liam); border-bottom: 3px solid #2D3748; padding: 0 5px;">${l}</span>` : '<span style="border-bottom: 3px solid #2D3748; padding: 0 15px;">&nbsp;</span>').join(' ')}
                </div>
                <div id="letter-options" style="display:grid; grid-template-columns: repeat(8, 1fr); gap: 10px; margin-top: 2rem;">
                    ${this.currentWordPool.map(l => `<button class="letter-btn" onclick="window.gameApp.handleStavaGuess('${l}')">${l}</button>`).join('')}
                </div>
            </div>
        `;
    },

    generateWordPool(word) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
        const wordLetters = word.split('');
        let possible = [...wordLetters];
        
        // Add random letters until we have 16
        while(possible.length < 16) {
            const randomL = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (!possible.includes(randomL)) possible.push(randomL);
        }
        
        return [...new Set(possible)].sort();
    },

    handleStavaGuess(l) {
        const targetLetter = this.currentWord[this.currentGuessedCount];
        if (l === targetLetter) {
            this.currentGuessedCount++;
            this.renderStava();
            if (this.currentGuessedCount >= this.currentWord.length) {
                setTimeout(() => { 
                    this.showToast(this.cheer(), 1500); 
                    this.incrementProgress();
                    this.currentWord = null; 
                    this.currentGuessedCount = 0; 
                    this.renderStava(); 
                }, 500);
            }
        }
    },

    cheer() {
        const cheers = ['BRA JOBBAT!', 'SÅ DUKTIG!', 'HELT RÄTT!', 'DU ÄR EN STJÄRNA! ⭐', 'Snyggt stavat!', 'Härligt!'];
        return cheers[Math.floor(Math.random() * cheers.length)];
    }
});
