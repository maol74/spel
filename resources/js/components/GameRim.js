Object.assign(App.prototype, {
    initRimGame() {
        const div = this.screens['game-rim'];
        this._rimHistory = this._rimHistory || [];
        this.rimWords = [
            { target: 'KATT', rhyme: 'HATT', options: ['HUND', 'BIL', 'HATT'], icon: '🐱' },
            { target: 'BIL', rhyme: 'PIL', options: ['SOL', 'PIL', 'BOLL'], icon: '🚗' },
            { target: 'HUS', rhyme: 'MUS', options: ['OST', 'MUS', 'SAFT'], icon: '🏠' },
            { target: 'SOL', rhyme: 'STOL', options: ['STOL', 'BORD', 'SÄNG'], icon: '☀️' },
            { target: 'BOK', rhyme: 'KROK', options: ['SAX', 'KROK', 'SKO'], icon: '📖' },
            { target: 'NÅL', rhyme: 'SKÅL', options: ['KNIV', 'SKÅL', 'TALLRIK'], icon: '📍' },
            { target: 'TÅG', rhyme: 'VÅG', options: ['BÅT', 'VÅG', 'CYKEL'], icon: '🚂' },
            { target: 'GRIS', rhyme: 'IS', options: ['SNÖ', 'IS', 'SOL'], icon: '🐷' },
            { target: 'SKO', rhyme: 'KO', options: ['HÄST', 'KO', 'FÅR'], icon: '👟' },
            { target: 'BUSS', rhyme: 'PUSS', options: ['KRAM', 'PUSS', 'HEJ'], icon: '🚌' },
            { target: 'MAT', rhyme: 'FAT', options: ['GLAS', 'FAT', 'SKED'], icon: '🍎' },
            { target: 'BOLL', rhyme: 'TROLL', options: ['LEK', 'TROLL', 'SAGA'], icon: '⚽' },
            { target: 'FÅR', rhyme: 'HÅR', options: ['BEN', 'HÅR', 'NÄSA'], icon: '🐑' },
            { target: 'KNIV', rhyme: 'LIV', options: ['VÄG', 'LIV', 'SKOG'], icon: '🍴' },
            { target: 'SAFT', rhyme: 'KRAFT', options: ['MJÖLK', 'KRAFT', 'IS'], icon: '🥤' },
            { target: 'STJÄRNA', rhyme: 'GÄRNA', options: ['MÅNE', 'GÄRNA', 'SOL'], icon: '⭐' },
            { target: 'GLASS', rhyme: 'PASS', options: ['GODIS', 'PASS', 'TÅG'], icon: '🍦' },
            { target: 'RÄV', rhyme: 'STÄV', options: ['DJUR', 'STÄV', 'BÅT'], icon: '🦊' },
            { target: 'KRAM', rhyme: 'STAM', options: ['TRÄD', 'STAM', 'BLAD'], icon: '🫂' },
            { target: 'NÄSA', rhyme: 'LÄSA', options: ['ÖGA', 'LÄSA', 'BOK'], icon: '👃' }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 800px; margin: 20px auto; padding: 40px; text-align: center; position: relative;">
                ${this.getBackButton('word-menu')}
                <h1 style="color: #FF6B6B; margin-bottom: 40px;">Rim-Stugan 🏠</h1>
                <div id="rim-container" style="display: flex; flex-direction: column; align-items: center; gap: 30px;">
                    <div style="font-size: 2rem; color: #CBD5E0;">Vad rimmar på...</div>
                    <div id="rim-target-box" style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 30px; border: 4px solid #FF6B6B; min-width: 250px;">
                        <div id="rim-target-icon" style="font-size: 6rem; margin-bottom: 10px;">❓</div>
                        <div id="rim-target-text" style="font-size: 3rem; font-weight: bold; color: white; letter-spacing: 2px;">ORD</div>
                    </div>
                    <div id="rim-options" style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; margin-top: 20px;"></div>
                </div>
                <div style="margin-top: 50px;">
                    <button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('word-menu')">Tillbaka</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.nextRimRound();
    },

    nextRimRound() {
        const targetIcon = document.getElementById('rim-target-icon');
        const targetText = document.getElementById('rim-target-text');
        const optionsEl = document.getElementById('rim-options');
        if (!targetIcon || !targetText || !optionsEl) return;

        // Filter words to avoid repeats (min 8 others in between)
        let available = this.rimWords.filter(w => !this._rimHistory.includes(w.target));
        if (available.length < 2) {
            this._rimHistory = this._rimHistory.slice(-2); // Keep only very last ones to break loop
            available = this.rimWords.filter(w => !this._rimHistory.includes(w.target));
        }

        const round = available[Math.floor(Math.random() * available.length)];
        
        // Update history
        this._rimHistory.push(round.target);
        if (this._rimHistory.length > 8) this._rimHistory.shift();

        targetIcon.innerText = round.icon;
        targetText.innerText = round.target;

        // Shuffle options
        const options = [...round.options].sort(() => Math.random() - 0.5);

        optionsEl.innerHTML = options.map(opt => `
            <div class="rim-option" onclick="window.gameApp.checkRim('${opt}', '${round.rhyme}')" 
                 style="background: #2D3748; border: 4px solid #4A5568; padding: 20px 40px; border-radius: 20px; 
                        font-size: 2rem; font-weight: bold; color: white; cursor: pointer; transition: all 0.2s; min-width: 150px;">
                ${opt}
            </div>
        `).join('');
    },

    checkRim(picked, correct) {
        if (picked === correct) {
            this.showToast('SNYGGT RIM! 🌟🏠✨', 1500);
            this.addScore(3);
            this.incrementProgress();
            this.cheer('jump');
            
            const options = document.querySelectorAll('.rim-option');
            options.forEach(opt => {
                if (opt.innerText.trim() === correct) {
                    opt.style.background = '#2ECC71';
                    opt.style.borderColor = '#27AE60';
                    opt.style.transform = 'scale(1.1)';
                } else {
                    opt.style.opacity = '0.3';
                }
            });

            setTimeout(() => this.nextRimRound(), 2000);
        } else {
            this.showToast('Nja, det rimmar inte riktigt... 😅', 1000);
            const options = document.querySelectorAll('.rim-option');
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
