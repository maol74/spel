Object.assign(App.prototype, {
    initMazeGame() {
        const div = this.screens['game-maze'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="background: #FFF9C4; min-height: 600px; text-align: center; position: relative; padding: 20px;">
                <div style="position: absolute; top: 20px; left: 20px;">
                    ${this.getBackButton('letter-menu')}
                </div>

                <div id="maze-mission" style="background: white; padding: 15px 30px; border-radius: 20px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 20px; border: 4px solid #FBC02D;">
                    <h2 style="color: #F57F17; margin: 0;">Bokstavs-Labyrinten 🌀</h2>
                    <p style="margin: 5px 0; color: #7F8C8D;">Hjälp gubben till målet! Gå bara på: <span id="maze-target-char" style="font-size: 2.5rem; color: #E91E63; font-weight: 900;">A</span></p>
                </div>

                <div id="maze-container" style="display: grid; gap: 10px; margin: 0 auto; background: #FBC02D; padding: 15px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); max-width: 500px;">
                    <!-- Maze cells generated here -->
                </div>

                <div style="margin-top: 20px; display: flex; justify-content: center; gap: 40px; font-weight: bold; color: #7F8C8D;">
                    <span>🏁 Mål</span>
                    <span>🏃 Start</span>
                </div>
            </div>
            ${this.getCheerleader()}
        `;

        this.nextMazeRound();
    },

    nextMazeRound() {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
        const lower = "abcdefghijklmnopqrstuvwxyzåäö";
        const all = upper + lower;
        
        const size = 6;
        const container = document.getElementById('maze-container');
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        container.innerHTML = '';

        // Generate a random path from 0,0 to size-1,size-1
        const pathCoords = [];
        let cx = 0, cy = 0;
        pathCoords.push(`${cx},${cy}`);
        while (cx < size - 1 || cy < size - 1) {
            if (cx < size - 1 && (Math.random() > 0.5 || cy === size - 1)) cx++;
            else cy++;
            pathCoords.push(`${cx},${cy}`);
        }

        this.mazePath = pathCoords;
        this.mazePlayer = { x: 0, y: 0 };
        this.mazeStep = 0;
        
        // Pre-assign a unique letter to each step in the path and random bonuses
        this.mazePathLetters = pathCoords.map(() => all[Math.floor(Math.random() * all.length)]);
        this.mazeBonuses = pathCoords.map((_, i) => (i > 0 && Math.random() < 0.2)); // 20% chance for bonus, except start
        this.mazeTarget = this.mazePathLetters[1]; 

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const pathIndex = pathCoords.indexOf(`${c},${r}`);
                let char;
                if (pathIndex !== -1) {
                    char = this.mazePathLetters[pathIndex];
                } else {
                    char = all[Math.floor(Math.random() * all.length)];
                }

                const cell = document.createElement('div');
                cell.id = `maze-${c}-${r}`;
                cell.className = 'maze-cell';
                cell.style.cssText = `
                    width: 60px; height: 60px; background: white; border-radius: 10px; 
                    display: flex; justify-content: center; align-items: center; 
                    font-size: 2rem; font-weight: bold; color: #34495E; cursor: pointer;
                    transition: all 0.2s; position: relative;
                `;
                cell.innerText = char;

                if (pathIndex !== -1 && this.mazeBonuses[pathIndex]) {
                    cell.innerHTML += `<div class="maze-bonus" style="position: absolute; top: 2px; right: 2px; font-size: 1rem; filter: drop-shadow(0 0 2px orange);">⭐</div>`;
                }

                if (c === 0 && r === 0) {
                    cell.innerHTML += `<div id="maze-player" style="position: absolute; font-size: 2.5rem; z-index: 10; transition: all 0.3s;">🏃</div>`;
                    cell.style.background = '#E1F5FE';
                }
                if (c === size - 1 && r === size - 1) cell.style.background = '#E8F5E9'; // Goal color

                cell.onclick = () => this.handleMazeMove(c, r);
                container.appendChild(cell);
            }
        }
        this.updateMazeInstructions();
    },

    updateMazeInstructions() {
        const el = document.getElementById('maze-target-char');
        if (el) {
            if (this.mazeStep < this.mazePathLetters.length - 1) {
                el.innerText = this.mazePathLetters[this.mazeStep + 1];
            } else {
                el.innerText = 'MÅL!';
            }
        }
    },

    handleMazeMove(x, y) {
        // Must be adjacent to current position
        const dx = Math.abs(this.mazePlayer.x - x);
        const dy = Math.abs(this.mazePlayer.y - y);
        
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // Check if this move is the NEXT step in the path
            const nextStep = this.mazePath[this.mazeStep + 1];
            if (nextStep === `${x},${y}`) {
                this.mazeStep++;
                this.mazePlayer = { x, y };
                const player = document.getElementById('maze-player');
                const cell = document.getElementById(`maze-${x}-${y}`);
                
                // Handle bonus
                const bonusEl = cell.querySelector('.maze-bonus');
                if (bonusEl) {
                    this.addScore(20);
                    this.showToast('BONUS-STJÄRNA! ⭐ +20', 1000);
                    bonusEl.style.transform = 'scale(3) rotate(360deg)';
                    bonusEl.style.opacity = '0';
                    setTimeout(() => bonusEl.remove(), 500);
                }

                cell.appendChild(player);
                cell.style.background = '#E1F5FE';
                this.addScore(2);
                
                this.updateMazeInstructions();

                if (x === 5 && y === 5) {
                    this.showToast('DU ÄR FRAMME! 🏆🎉', 1500);
                    this.addScore(10);
                    this.incrementProgress();
                    this.cheer('jump');
                    setTimeout(() => this.nextMazeRound(), 2000);
                }
            } else {
                this.showToast('Hoppsan! Gå på bokstaven i rutan! 😅', 500);
                const cell = document.getElementById(`maze-${x}-${y}`);
                cell.style.background = '#FFCDD2';
                setTimeout(() => { if (cell.style.background !== 'rgb(225, 245, 254)') cell.style.background = 'white'; }, 500);
            }
        }
    }
});
