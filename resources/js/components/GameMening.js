Object.assign(App.prototype, {
    initMeningGame() {
        const div = this.screens['game-mening'];
        this._meningHistory = this._meningHistory || [];
        this.meningPool = [
            { text: 'WILLIAM ÄTER GLASS', icon: '🍦' },
            { text: 'LIAM LEKER MED BILAR', icon: '🚗' },
            { text: 'DRAKEN FLYGER I RYMDEN', icon: '🐲' },
            { text: 'ROBBAN GILLAR ATT DANSA', icon: '🤖' },
            { text: 'SOLEN LYSER PÅ OSS', icon: '☀️' },
            { text: 'HUNDEN JAGAR EN BOLL', icon: '🐶' },
            { text: 'KATTEN SOVER I SÄNGEN', icon: '🐱' },
            { text: 'VI GILLAR ATT SPELA', icon: '🎮' },
            { text: 'NINJAN HOPPAR ÖVER TRÄDET', icon: '🥷' },
            { text: 'SUPERHJÄLTEN RÄDDAR DAGEN', icon: '🦸' },
            { text: 'PINGVINEN GLIDER PÅ ISEN', icon: '🐧' },
            { text: 'MONSTRET ÄR SNÄLLT OCH GLATT', icon: '👾' },
            { text: 'MAMMA OCH PAPPA ÄLSKAR OSS', icon: '❤️' },
            { text: 'VI SKA GÅ TILL PARKEN', icon: '🌳' },
            { text: 'ÄPPLET ÄR RÖTT OCH GOTT', icon: '🍎' },
            { text: 'FISKEN SIMMAR I VATTNET', icon: '🐟' },
            { text: 'FÅGELN SJUNGER EN SÅNG', icon: '🐦' },
            { text: 'RAKETEN SUSAR MOT MÅNEN', icon: '🚀' },
            { text: 'KANINEN HOPPAR I GRÄSET', icon: '🐰' },
            { text: 'TÅGET TUTAR OCH KÖR', icon: '🚂' }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 900px; margin: 20px auto; padding: 40px; text-align: center; position: relative;">
                ${this.getBackButton('word-menu')}
                <h1 style="color: #2ECC71; margin-bottom: 40px;">Mening-Byggaren 🏗️</h1>
                <div id="mening-container" style="display: flex; flex-direction: column; align-items: center; gap: 40px;">
                    <div id="mening-icon" style="font-size: 5rem; animation: bounce 2s infinite;">❓</div>
                    <div style="font-size: 1.5rem; color: #CBD5E0;">Sätt orden i rätt ordning!</div>
                    
                    <!-- Target Area -->
                    <div id="mening-target" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; min-height: 80px; width: 100%; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 20px; border: 3px dashed #4A5568;"></div>
                    
                    <!-- Source Area -->
                    <div id="mening-source" style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; margin-top: 20px;"></div>
                </div>
                <div style="margin-top: 50px; display: flex; gap: 15px; justify-content: center;">
                    <button class="menu-card" style="width: auto; padding: 10px 30px; background: #718096;" onclick="window.gameApp.resetMening()">Rensa 🔄</button>
                    <button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('word-menu')">Tillbaka</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.nextMeningRound();
    },

    nextMeningRound() {
        const targetEl = document.getElementById('mening-target');
        const sourceEl = document.getElementById('mening-source');
        const iconEl = document.getElementById('mening-icon');
        if (!targetEl || !sourceEl || !iconEl) return;

        // Filter to avoid repeats (min 8 others in between)
        let available = this.meningPool.filter(m => !this._meningHistory.includes(m.text));
        if (available.length < 2) {
            this._meningHistory = this._meningHistory.slice(-2);
            available = this.meningPool.filter(m => !this._meningHistory.includes(m.text));
        }

        const round = available[Math.floor(Math.random() * available.length)];
        
        // Update history
        this._meningHistory.push(round.text);
        if (this._meningHistory.length > 8) this._meningHistory.shift();

        this._meningCorrect = round.text.split(' ');
        this._meningCurrent = [];
        iconEl.innerText = round.icon;

        targetEl.innerHTML = '';
        
        // Shuffle words
        const words = [...this._meningCorrect].sort(() => Math.random() - 0.5);

        sourceEl.innerHTML = words.map((w, i) => `
            <div class="mening-word" onclick="window.gameApp.addMeningWord('${w}', this)" 
                 style="background: #2D3748; border: 3px solid #4A5568; padding: 15px 25px; border-radius: 15px; 
                        font-size: 1.8rem; font-weight: bold; color: white; cursor: pointer; transition: all 0.2s;">
                ${w}
            </div>
        `).join('');
    },

    addMeningWord(word, el) {
        if (!el || el.style.opacity === '0.3') return;
        
        const targetEl = document.getElementById('mening-target');
        this._meningCurrent.push(word);
        el.style.opacity = '0.3';
        el.style.pointerEvents = 'none';

        const wordEl = document.createElement('div');
        wordEl.innerText = word;
        Object.assign(wordEl.style, {
            background: 'var(--color-william)',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: 'white',
            animation: 'popIn 0.3s ease-out forwards'
        });
        targetEl.appendChild(wordEl);

        // Check if finished
        if (this._meningCurrent.length === this._meningCorrect.length) {
            if (this._meningCurrent.join(' ') === this._meningCorrect.join(' ')) {
                this.showToast('STRÅLANDE MENING! 🌟🏗️✨', 1500);
                this.addScore(5);
                this.incrementProgress();
                this.cheer('jump');
                setTimeout(() => this.nextMeningRound(), 2500);
            } else {
                this.showToast('Nja, orden hamnade lite fel. Prova igen! 🔄', 2000);
                setTimeout(() => this.resetMening(), 1500);
            }
        }
    },

    resetMening() {
        this._meningCurrent = [];
        const targetEl = document.getElementById('mening-target');
        if (targetEl) targetEl.innerHTML = '';
        const words = document.querySelectorAll('.mening-word');
        words.forEach(w => {
            w.style.opacity = '1';
            w.style.pointerEvents = 'auto';
        });
    }
});
