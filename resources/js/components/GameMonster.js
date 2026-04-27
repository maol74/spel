Object.assign(App.prototype, {
    initMonsterGame() {
        const div = this.screens['game-monster'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 800px; margin: 20px auto; padding: 40px; text-align: center; position: relative;">
                ${this.getBackButton('math-menu')}
                <h1 style="color: #9B59B6; margin-bottom: 40px;">Mönster-Magikern 🌈</h1>
                <div id="monster-container" style="display: flex; flex-direction: column; align-items: center; gap: 40px;">
                    <div style="font-size: 1.5rem; color: #CBD5E0;">Vad kommer näst i mönstret?</div>
                    <div id="monster-pattern" style="display: flex; gap: 15px; background: rgba(255,255,255,0.05); padding: 30px; border-radius: 30px; border: 4px solid #9B59B6; min-height: 120px; align-items: center;"></div>
                    <div id="monster-options" style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;"></div>
                </div>
                <div style="margin-top: 50px;">
                    <button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('math-menu')">Tillbaka</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.nextMonsterRound();
    },

    nextMonsterRound() {
        const patternEl = document.getElementById('monster-pattern');
        const optionsEl = document.getElementById('monster-options');
        if (!patternEl || !optionsEl) return;

        const items = ['🍎', '🍌', '🍇', '🍓', '🚗', '🚀', '⭐', '🌈', '🍦', '🍪'];
        const numItems = this.state.difficulty > 3 ? 3 : 2;
        const selected = [];
        while (selected.length < numItems) {
            const r = items[Math.floor(Math.random() * items.length)];
            if (!selected.includes(r)) selected.push(r);
        }

        // Patterns: ABAB, AABAAB, ABBABB, ABCABC
        this._monsterHistory = this._monsterHistory || [];
        
        const patternTypes = ['ABAB', 'AABAAB', 'ABBABB'];
        if (numItems >= 3) patternTypes.push('ABCABC');
        
        let type;
        do {
            type = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        } while (type === this._lastMonsterType && patternTypes.length > 1);
        
        this._lastMonsterType = type;

        let pattern = [];
        let correct;

        if (type === 'ABAB') {
            pattern = [selected[0], selected[1], selected[0], selected[1], selected[0]];
            correct = selected[1];
        } else if (type === 'AABAAB') {
            pattern = [selected[0], selected[0], selected[1], selected[0], selected[0]];
            correct = selected[1];
        } else if (type === 'ABBABB') {
            pattern = [selected[0], selected[1], selected[1], selected[0], selected[1]];
            correct = selected[1];
        } else if (type === 'ABCABC') {
            pattern = [selected[0], selected[1], selected[2], selected[0], selected[1]];
            correct = selected[2];
        }

        this._monsterCorrect = correct;

        patternEl.innerHTML = `
            ${pattern.map(item => `<div style="font-size: 4rem; animation: popIn 0.3s ease-out forwards;">${item}</div>`).join('')}
            <div style="font-size: 4rem; color: #9B59B6; font-weight: bold; border: 4px dashed #9B59B6; width: 80px; height: 80px; border-radius: 20px; display: flex; align-items: center; justify-content: center;">?</div>
        `;

        // Options
        const options = [correct];
        while (options.length < 4) {
            const rand = items[Math.floor(Math.random() * items.length)];
            if (!options.includes(rand)) options.push(rand);
        }
        options.sort(() => Math.random() - 0.5);

        optionsEl.innerHTML = options.map(opt => `
            <div class="monster-option" onclick="window.gameApp.checkMonster('${opt}')" 
                 style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; 
                        background: #2D3748; border: 4px solid #4A5568; border-radius: 20px; font-size: 3rem; 
                        cursor: pointer; transition: all 0.2s;">
                ${opt}
            </div>
        `).join('');
    },

    checkMonster(picked) {
        if (picked === this._monsterCorrect) {
            this.showToast('MAGISKT! 🌟🌈✨', 1500);
            this.addScore(3);
            this.incrementProgress();
            this.cheer('jump');
            
            const patternEl = document.getElementById('monster-pattern');
            if (patternEl) {
                const q = patternEl.querySelector('div:last-child');
                if (q) {
                    q.innerText = picked;
                    q.style.borderStyle = 'solid';
                    q.style.color = 'white';
                    q.style.background = 'rgba(46, 204, 113, 0.2)';
                }
            }

            const options = document.querySelectorAll('.monster-option');
            options.forEach(opt => {
                if (opt.innerText.trim() === picked) {
                    opt.style.background = '#2ECC71';
                    opt.style.borderColor = '#27AE60';
                } else {
                    opt.style.opacity = '0.3';
                }
            });

            setTimeout(() => this.nextMonsterRound(), 2000);
        } else {
            this.showToast('Hoppsan! Något blev fel i magin. 😅', 1000);
            const options = document.querySelectorAll('.monster-option');
            options.forEach(opt => {
                if (opt.innerText.trim() === picked) {
                    opt.style.background = '#E74C3C';
                    opt.style.borderColor = '#C0392B';
                    opt.style.transform = 'translateY(10px)';
                    setTimeout(() => opt.style.transform = '', 200);
                }
            });
        }
    }
});
