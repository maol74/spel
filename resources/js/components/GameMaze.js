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
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
        this.mazeTarget = letters[Math.floor(Math.random() * letters.length)];
        document.getElementById('maze-target-char').innerText = this.mazeTarget;

        const size = 6;
        const container = document.getElementById('maze-container');
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        container.innerHTML = '';

        // Generate a random path from 0,0 to size-1,size-1
        const path = [];
        let cx = 0, cy = 0;
        path.push(`${cx},${cy}`);
        while (cx < size - 1 || cy < size - 1) {
            if (cx < size - 1 && (Math.random() > 0.5 || cy === size - 1)) cx++;
            else cy++;
            path.push(`${cx},${cy}`);
        }

        this.mazePlayer = { x: 0, y: 0 };
        this.mazeGrid = [];

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const isPath = path.includes(`${c},${r}`);
                let char = letters[Math.floor(Math.random() * letters.length)];
                if (isPath) char = this.mazeTarget;
                else if (char === this.mazeTarget) char = letters[(letters.indexOf(char) + 1) % letters.length];

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

                if (c === 0 && r === 0) cell.innerHTML += `<div id="maze-player" style="position: absolute; font-size: 2.5rem; z-index: 10; transition: all 0.3s;">🏃</div>`;
                if (c === size - 1 && r === size - 1) cell.style.background = '#E8F5E9'; // Goal color

                cell.onclick = () => this.handleMazeMove(c, r);
                container.appendChild(cell);
            }
        }
    },

    handleMazeMove(x, y) {
        // Must be adjacent to current position
        const dx = Math.abs(this.mazePlayer.x - x);
        const dy = Math.abs(this.mazePlayer.y - y);
        
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            const cell = document.getElementById(`maze-${x}-${y}`);
            if (cell.innerText.includes(this.mazeTarget)) {
                this.mazePlayer = { x, y };
                const player = document.getElementById('maze-player');
                cell.appendChild(player);
                this.addScore(2);
                
                if (x === 5 && y === 5) {
                    this.showToast('DU ÄR FRAMME! 🏆🎉', 1500);
                    this.addScore(10);
                    this.incrementProgress();
                    this.cheer('jump');
                    setTimeout(() => this.nextMazeRound(), 2000);
                }
            } else {
                this.showToast('Aj! Fel bokstav! 😅', 500);
                cell.style.background = '#FFCDD2';
                setTimeout(() => cell.style.background = 'white', 500);
            }
        }
    }
});
