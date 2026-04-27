Object.assign(App.prototype, {
    initFirstLetterGame() {
        const div = this.screens['game-forsta'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 800px; margin: 20px auto; padding: 30px; text-align: center;">
                <h1 style="color: #F1C40F; margin-bottom: 30px;">Vad börjar det på? 🍎</h1>
                <div id="first-letter-container" style="display: flex; flex-direction: column; align-items: center; gap: 40px;">
                    <div id="first-letter-target" style="font-size: 8rem; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); animation: float 3s ease-in-out infinite;">❓</div>
                    <div id="first-letter-options" style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;"></div>
                </div>
                <div style="margin-top: 50px;">
                    <button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('letter-menu')">Tillbaka</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.nextFirstLetterRound();
    },

    nextFirstLetterRound() {
        const targetEl = document.getElementById('first-letter-target');
        const optionsEl = document.getElementById('first-letter-options');
        if (!targetEl || !optionsEl) return;

        // Pick a random word from config based on difficulty
        const words = CONFIG.difficultyWords[this.state.difficulty] || CONFIG.difficultyWords[1];
        const word = words[Math.floor(Math.random() * words.length)];
        const emoji = CONFIG.wordEmojis[word] || '❓';
        const correctLetter = word.charAt(0);

        targetEl.innerText = emoji;
        targetEl.dataset.word = word;

        // Generate options
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
        const options = [correctLetter];
        while (options.length < (this.state.difficulty > 3 ? 6 : 4)) {
            const rand = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (!options.includes(rand)) options.push(rand);
        }
        options.sort(() => Math.random() - 0.5);

        optionsEl.innerHTML = options.map(l => `
            <div class="letter-option" onclick="window.gameApp.checkFirstLetter('${l}', '${correctLetter}')" 
                 style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; 
                        background: #2D3748; border: 4px solid #4A5568; border-radius: 20px; font-size: 2.5rem; 
                        color: white; font-weight: bold; cursor: pointer; transition: all 0.2s;">
                ${l}
            </div>
        `).join('');
    },

    checkFirstLetter(picked, correct) {
        if (picked === correct) {
            this.showToast('RÄTT! 🌟👏✨', 1500);
            this.addScore(1);
            this.incrementProgress();
            this.cheer('jump');
            
            // Visual feedback
            const options = document.querySelectorAll('.letter-option');
            options.forEach(opt => {
                if (opt.innerText.trim() === correct) {
                    opt.style.background = '#2ECC71';
                    opt.style.borderColor = '#27AE60';
                    opt.style.transform = 'scale(1.2)';
                } else {
                    opt.style.opacity = '0.3';
                }
            });

            setTimeout(() => this.nextFirstLetterRound(), 1500);
        } else {
            this.showToast('Hoppsan! Prova igen. 😅', 1000);
            const options = document.querySelectorAll('.letter-option');
            options.forEach(opt => {
                if (opt.innerText.trim() === picked) {
                    opt.style.background = '#E74C3C';
                    opt.style.borderColor = '#C0392B';
                    opt.style.transform = 'translateX(10px)';
                    setTimeout(() => opt.style.transform = '', 200);
                }
            });
        }
    }
});
