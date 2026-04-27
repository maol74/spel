Object.assign(App.prototype, {
    initGommaGame() {
        const div = this.screens['game-gomma'];
        this._gommaHistory = this._gommaHistory || [];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 900px; margin: 20px auto; padding: 40px; text-align: center; position: relative;">
                ${this.getBackButton('word-menu')}
                <h1 style="color: #9B59B6; margin-bottom: 30px;">Ord-Gömman 🕵️</h1>
                <div id="gomma-container" style="display: flex; flex-direction: column; align-items: center; gap: 30px;">
                    <div style="font-size: 1.5rem; color: #CBD5E0;">Hitta ordet i rutnätet!</div>
                    <div id="gomma-target-word" style="font-size: 3rem; font-weight: bold; color: #F1C40F; letter-spacing: 5px; background: rgba(0,0,0,0.2); padding: 10px 30px; border-radius: 15px;">WORD</div>
                    <div id="gomma-grid" style="display: grid; gap: 8px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 20px; border: 4px solid #9B59B6; user-select: none;"></div>
                </div>
                <div style="margin-top: 40px;">
                    <button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('word-menu')">Tillbaka</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.nextGommaRound();
    },

    nextGommaRound() {
        const gridEl = document.getElementById('gomma-grid');
        const targetEl = document.getElementById('gomma-target-word');
        if (!gridEl || !targetEl) return;

        const words = CONFIG.difficultyWords[this.state.difficulty] || CONFIG.difficultyWords[1];
        
        // Filter to avoid repeats
        let available = words.filter(w => !this._gommaHistory.includes(w));
        if (available.length < 2) {
            this._gommaHistory = this._gommaHistory.slice(-2);
            available = words.filter(w => !this._gommaHistory.includes(w));
        }

        const target = available[Math.floor(Math.random() * available.length)];
        
        // Update history
        this._gommaHistory.push(target);
        if (this._gommaHistory.length > 8) this._gommaHistory.shift();

        targetEl.innerText = target;

        const size = this.state.difficulty > 3 ? 8 : 6;
        gridEl.style.gridTemplateColumns = `repeat(${size}, 60px)`;
        gridEl.style.gridTemplateRows = `repeat(${size}, 60px)`;

        // Create empty grid
        const grid = Array(size).fill().map(() => Array(size).fill(''));

        // Place word (horizontal, vertical, or diagonal)
        const directions = ['H', 'V'];
        if (this.state.difficulty > 2) directions.push('D1', 'D2'); // D1: down-right, D2: down-left
        const dir = directions[Math.floor(Math.random() * directions.length)];
        
        let r, c;
        if (dir === 'H') {
            r = Math.floor(Math.random() * size);
            c = Math.floor(Math.random() * (size - target.length));
            for (let i = 0; i < target.length; i++) grid[r][c + i] = target[i];
        } else if (dir === 'V') {
            r = Math.floor(Math.random() * (size - target.length));
            c = Math.floor(Math.random() * size);
            for (let i = 0; i < target.length; i++) grid[r + i][c] = target[i];
        } else if (dir === 'D1') {
            r = Math.floor(Math.random() * (size - target.length));
            c = Math.floor(Math.random() * (size - target.length));
            for (let i = 0; i < target.length; i++) grid[r + i][c + i] = target[i];
        } else if (dir === 'D2') {
            r = Math.floor(Math.random() * (size - target.length));
            c = Math.floor(Math.random() * (size - target.length)) + target.length - 1;
            for (let i = 0; i < target.length; i++) grid[r + i][c - i] = target[i];
        }

        // Fill rest with random letters
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (grid[i][j] === '') grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
            }
        }

        this._gommaGrid = grid;
        this._gommaTarget = target;
        this._gommaFoundCount = 0;
        this._gommaSelected = [];

        gridEl.innerHTML = '';
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.innerText = grid[i][j];
                cell.className = 'gomma-cell';
                cell.dataset.r = i;
                cell.dataset.c = j;
                Object.assign(cell.style, {
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#2D3748',
                    borderRadius: '10px',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '2px solid #4A5568'
                });
                cell.onclick = () => this.selectGommaCell(cell, i, j);
                gridEl.appendChild(cell);
            }
        }
    },

    selectGommaCell(el, r, c) {
        if (el.style.background === 'rgb(46, 204, 113)') return; // Already found

        const index = this._gommaSelected.findIndex(s => s.r === r && s.c === c);
        if (index !== -1) {
            this._gommaSelected.splice(index, 1);
            el.style.background = '#2D3748';
            el.style.borderColor = '#4A5568';
        } else {
            this._gommaSelected.push({ r, c, char: el.innerText });
            el.style.background = '#3498DB';
            el.style.borderColor = '#2980B9';
        }

        // Check if correct letters in any order (but we need them to match the target)
        const selectedStr = this._gommaSelected.map(s => s.char).join('');
        // To keep it simple for kids, just check if the selected letters match the target word letters
        if (this._gommaSelected.length === this._gommaTarget.length) {
            // Sort selected by row/col to see if they form the word
            this._gommaSelected.sort((a, b) => a.r === b.r ? a.c - b.c : a.r - b.r);
            const formed = this._gommaSelected.map(s => s.char).join('');
            
            if (formed === this._gommaTarget) {
                this.showToast('HITTAT! 🕵️🌟✨', 1500);
                this.addScore(5);
                this.incrementProgress();
                this.cheer('jump');
                
                this._gommaSelected.forEach(s => {
                    const cell = document.querySelector(`.gomma-cell[data-r="${s.r}"][data-c="${s.c}"]`);
                    if (cell) {
                        cell.style.background = '#2ECC71';
                        cell.style.borderColor = '#27AE60';
                    }
                });
                
                setTimeout(() => this.nextGommaRound(), 2500);
            } else {
                // Wrong word
                this._gommaSelected.forEach(s => {
                    const cell = document.querySelector(`.gomma-cell[data-r="${s.r}"][data-c="${s.c}"]`);
                    if (cell) {
                        cell.style.background = '#E74C3C';
                        setTimeout(() => {
                            if (cell.style.background === 'rgb(231, 76, 60)') {
                                cell.style.background = '#2D3748';
                                cell.style.borderColor = '#4A5568';
                            }
                        }, 500);
                    }
                });
                this._gommaSelected = [];
            }
        }
    }
});
