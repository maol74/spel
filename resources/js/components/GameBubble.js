Object.assign(App.prototype, {
    initGameBubble() {
        const div = this.screens['game-bubble'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="bubble-container" style="position: relative; width: 600px; height: 500px; margin: 0 auto; background: #1A202C; border: 8px solid #4A5568; border-radius: 30px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                
                <div id="bubble-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white;">
                    <h1 id="bubble-status-text" style="font-size: 3rem; margin-bottom: 20px;">GAME OVER</h1>
                    <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.5rem;" onclick="window.gameApp.initGameBubble()">Spela Igen! 🔄</button>
                    <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('spel-menu')">Tillbaka till menyn 🏠</button>
                </div>

                <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; z-index: 20;">
                    <div style="background: rgba(0,0,0,0.7); padding: 5px 15px; border-radius: 15px; color: white; font-weight: bold; font-size: 0.9rem; border: 2px solid #3498DB;">
                        NÄSTA RAD: <span id="bubble-timer">30</span>s
                    </div>
                    <div id="bubble-score" style="background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 1.2rem; border: 2px solid #F1C40F; backdrop-filter: blur(5px);">
                        POÄNG: <span id="bubble-count">0</span>
                    </div>
                </div>

                <div id="bubble-grid" style="width: 100%; height: 100%; position: relative;"></div>
                
                <div id="bubble-aim-line" style="position: absolute; bottom: 40px; left: 300px; width: 0; height: 0; z-index: 5; pointer-events: none;">
                    ${[1, 2, 3, 4, 5, 6, 7, 8].map(i => `<div class="aim-dot" style="position: absolute; width: 6px; height: 6px; background: #F1C40F; border-radius: 50%; box-shadow: 0 0 5px #F1C40F;"></div>`).join('')}
                </div>

                <div id="bubble-cannon" style="position: absolute; bottom: 0; left: 50%; width: 60px; height: 80px; transform: translateX(-50%); z-index: 15; pointer-events: none;">
                    <div id="cannon-barrel" style="width: 40px; height: 60px; background: #4A5568; border-radius: 20px 20px 5px 5px; margin: 0 auto; border: 3px solid #2D3748; transform-origin: bottom center;"></div>
                    <div id="next-bubble" style="width: 40px; height: 40px; border-radius: 50%; position: absolute; bottom: 0; left: 10px; border: 3px solid rgba(255,255,255,0.3); box-shadow: inset 0 0 10px rgba(0,0,0,0.5);"></div>
                </div>

                <div style="position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.5); padding: 8px 20px; border-radius: 15px; color: white; font-weight: bold; font-size: 1.1rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(5px); z-index: 10;">
                    Sikta och skjut för att matcha 3 färger! 🔵🔴🟢
                </div>
                
                <div id="fail-line" style="position: absolute; bottom: 100px; left: 0; width: 100%; height: 2px; background: rgba(231, 76, 60, 0.3); border-top: 1px dashed #E74C3C;"></div>
            </div>
            <style>
                .bubble { position: absolute; width: 40px; height: 40px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.2); box-shadow: inset -5px -5px 10px rgba(0,0,0,0.3), 2px 2px 5px rgba(0,0,0,0.1); transition: transform 0.2s, top 0.3s ease-out, left 0.3s ease-out; z-index: 5; }
                .bubble-pop { animation: popOut 0.3s ease-out forwards; }
                @keyframes popOut {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .aim-dot { transform: translate(-50%, -50%); }
            </style>
        `;

        this.bubbleColors = ['#E74C3C', '#3498DB', '#2ECC71', '#F1C40F', '#9B59B6', '#FFFFFF'];
        this.bubbleGrid = [];
        this.bubbleActive = true;
        this.bubbleScore = 0;
        this.shootingBubble = false;
        this.bubbleTimer = 30;
        
        const container = document.getElementById('bubble-container');
        const barrel = document.getElementById('cannon-barrel');
        const aimDots = div.querySelectorAll('.aim-dot');
        
        this.setupBubbleGrid();
        
        container.onmousemove = (e) => {
            if (!this.bubbleActive) return;
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - 300;
            const y = rect.bottom - e.clientY - 40;
            const angle = Math.atan2(x, y) * (180 / Math.PI);
            barrel.style.transform = `rotate(${angle}deg)`;
            this.cannonAngle = angle;
            
            if (!this.shootingBubble) {
                const rad = (angle - 90) * (Math.PI / 180);
                let curX = 0;
                let curY = 0;
                let curVX = Math.cos(rad) * 40;
                let curVY = Math.sin(rad) * 40;
                
                aimDots.forEach((dot, i) => {
                    curX += curVX;
                    curY += curVY;
                    if (curX < -300 || curX > 300) {
                        curVX = -curVX;
                        curX += curVX;
                    }
                    dot.style.display = 'block';
                    dot.style.left = curX + 'px';
                    dot.style.top = curY + 'px';
                });
            } else {
                aimDots.forEach(dot => dot.style.display = 'none');
            }
        };
        
        container.onclick = () => {
            if (!this.bubbleActive || this.shootingBubble) return;
            this.shootBubble();
        };

        if (this.bubbleTimerInterval) clearInterval(this.bubbleTimerInterval);
        this.bubbleTimerInterval = setInterval(() => {
            if (!this.bubbleActive) return;
            this.bubbleTimer--;
            const timerEl = document.getElementById('bubble-timer');
            if (timerEl) timerEl.innerText = this.bubbleTimer;
            
            if (this.bubbleTimer <= 0) {
                this.bubbleTimer = 30;
                this.addBubbleRow();
            }
        }, 1000);

        this.prepareNextBubble();
    },

    setupBubbleGrid() {
        const grid = document.getElementById('bubble-grid');
        this.bubbleGrid = [];
        for (let row = 0; row < 5; row++) {
            this.bubbleGrid[row] = [];
            for (let col = 0; col < 14; col++) {
                const color = this.bubbleColors[Math.floor(Math.random() * this.bubbleColors.length)];
                const b = this.createBubbleEl(color);
                const x = col * 40 + (row % 2 === 0 ? 20 : 40);
                const y = row * 35 + 20;
                b.style.left = x + 'px';
                b.style.top = y + 'px';
                grid.appendChild(b);
                this.bubbleGrid[row][col] = { el: b, color: color, row, col };
            }
        }
    },

    addBubbleRow() {
        const grid = document.getElementById('bubble-grid');
        if (!grid) return;

        // Move everything down
        for (let r = this.bubbleGrid.length - 1; r >= 0; r--) {
            if (!this.bubbleGrid[r]) continue;
            for (let c = 0; c < 14; c++) {
                const b = this.bubbleGrid[r][c];
                if (b) {
                    b.row = r + 1;
                    const offset = (b.row % 2 === 0 ? 20 : 40);
                    b.el.style.top = (b.row * 35 + 20) + 'px';
                    b.el.style.left = (b.col * 40 + offset) + 'px';
                    
                    if (!this.bubbleGrid[r+1]) this.bubbleGrid[r+1] = [];
                    this.bubbleGrid[r+1][c] = b;
                    this.bubbleGrid[r][c] = null;
                    
                    // Check Game Over
                    if (b.row * 35 + 20 > 380) {
                        this.showBubbleEnd(false);
                        return;
                    }
                }
            }
        }

        // Add new row at top
        this.bubbleGrid[0] = [];
        for (let col = 0; col < 14; col++) {
            const color = this.bubbleColors[Math.floor(Math.random() * this.bubbleColors.length)];
            const b = this.createBubbleEl(color);
            const x = col * 40 + 20; // row 0 offset is always 20
            const y = 20;
            b.style.left = x + 'px';
            b.style.top = y + 'px';
            grid.appendChild(b);
            this.bubbleGrid[0][col] = { el: b, color: color, row: 0, col: col };
        }
        
        this.showToast('Ny rad på väg ner! 🫧🚀');
    },

    createBubbleEl(color) {
        const b = document.createElement('div');
        b.className = 'bubble';
        b.style.backgroundColor = color;
        const gloss = document.createElement('div');
        gloss.style.cssText = `position: absolute; top: 15%; left: 20%; width: 25%; height: 15%; background: rgba(255,255,255,0.4); border-radius: 50%; pointer-events: none;`;
        b.appendChild(gloss);
        return b;
    },

    prepareNextBubble() {
        this.nextColor = this.bubbleColors[Math.floor(Math.random() * this.bubbleColors.length)];
        const nextEl = document.getElementById('next-bubble');
        if (nextEl) nextEl.style.backgroundColor = this.nextColor;
    },

    shootBubble() {
        this.shootingBubble = true;
        const container = document.getElementById('bubble-container');
        const b = this.createBubbleEl(this.nextColor);
        b.style.left = '280px';
        b.style.top = '420px';
        b.style.zIndex = '10';
        container.appendChild(b);
        
        const rad = (this.cannonAngle - 90) * (Math.PI / 180);
        let vx = Math.cos(rad) * 12;
        let vy = Math.sin(rad) * 12;
        let bx = 280;
        let by = 420;

        const move = () => {
            if (!this.bubbleActive) {
                b.remove();
                return;
            }
            bx += vx;
            by += vy;
            
            if (bx < 0) { bx = 0; vx = -vx; }
            if (bx > 560) { bx = 560; vx = -vx; }
            
            b.style.left = bx + 'px';
            b.style.top = by + 'px';
            
            let hit = false;
            if (by < 10) hit = true;
            
            for (let row = 0; row < this.bubbleGrid.length; row++) {
                if (!this.bubbleGrid[row]) continue;
                for (let col = 0; col < this.bubbleGrid[row].length; col++) {
                    const target = this.bubbleGrid[row][col];
                    if (target && target.el) {
                        const tx = parseFloat(target.el.style.left);
                        const ty = parseFloat(target.el.style.top);
                        const dist = Math.sqrt(Math.pow(bx - tx, 2) + Math.pow(by - ty, 2));
                        if (dist < 32) { hit = true; break; }
                    }
                }
                if (hit) break;
            }
            
            if (hit || by < 0) {
                this.snapToGrid(b, this.nextColor);
                this.shootingBubble = false;
                this.prepareNextBubble();
            } else if (by > 600) {
                b.remove();
                this.shootingBubble = false;
                this.prepareNextBubble();
            } else {
                requestAnimationFrame(move);
            }
        };
        requestAnimationFrame(move);
    },

    snapToGrid(el, color) {
        const bx = parseFloat(el.style.left);
        const by = parseFloat(el.style.top);
        
        const row = Math.round((by - 20) / 35);
        const offset = (row % 2 === 0 ? 20 : 40);
        const col = Math.round((bx - offset) / 40);
        
        if (row < 0) return;
        if (!this.bubbleGrid[row]) this.bubbleGrid[row] = [];
        
        if (this.bubbleGrid[row][col]) {
            el.remove();
            return;
        }
        
        const x = col * 40 + offset;
        const y = row * 35 + 20;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        
        this.bubbleGrid[row][col] = { el, color, row, col };
        
        const matches = this.findMatches(row, col, color);
        if (matches.length >= 3) {
            this.popBubbles(matches);
        }
        
        if (y > 380) {
            this.showBubbleEnd(false);
        }
    },

    findMatches(row, col, color, visited = new Set()) {
        const key = `${row},${col}`;
        if (visited.has(key)) return [];
        visited.add(key);
        const bubble = this.bubbleGrid[row] ? this.bubbleGrid[row][col] : null;
        if (!bubble || bubble.color !== color) return [];
        let matches = [bubble];
        const neighbors = this.getNeighbors(row, col);
        for (let n of neighbors) { matches = matches.concat(this.findMatches(n.row, n.col, color, visited)); }
        return matches;
    },

    getNeighbors(row, col) {
        const neighbors = [];
        const evenRow = row % 2 === 0;
        const directions = evenRow ? [[-1, 0], [-1, -1], [0, -1], [0, 1], [1, -1], [1, 0]] : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
        for (let [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (this.bubbleGrid[nr] && this.bubbleGrid[nr][nc]) neighbors.push({ row: nr, col: nc });
        }
        return neighbors;
    },

    popBubbles(matches) {
        matches.forEach(m => {
            if (m.el) { m.el.classList.add('bubble-pop'); setTimeout(() => m.el.remove(), 300); }
            this.bubbleGrid[m.row][m.col] = null;
            this.bubbleScore += 10;
        });
        const scoreEl = document.getElementById('bubble-count');
        if (scoreEl) scoreEl.innerText = this.bubbleScore;
        setTimeout(() => this.dropFloatingBubbles(), 350);
        if (this.bubbleScore >= 1000) this.showBubbleEnd(true);
    },

    dropFloatingBubbles() {
        const connected = new Set();
        for (let col = 0; col < 14; col++) { if (this.bubbleGrid[0] && this.bubbleGrid[0][col]) this.markConnected(0, col, connected); }
        for (let row = 0; row < this.bubbleGrid.length; row++) {
            if (!this.bubbleGrid[row]) continue;
            for (let col = 0; col < this.bubbleGrid[row].length; col++) {
                const b = this.bubbleGrid[row][col];
                if (b && !connected.has(`${row},${col}`)) {
                    const el = b.el;
                    el.style.transition = 'top 0.6s ease-in, opacity 0.6s';
                    el.style.top = '600px';
                    el.style.opacity = '0';
                    setTimeout(() => el.remove(), 600);
                    this.bubbleGrid[row][col] = null;
                    this.bubbleScore += 5;
                }
            }
        }
        const scoreEl = document.getElementById('bubble-count');
        if (scoreEl) scoreEl.innerText = this.bubbleScore;
    },

    markConnected(row, col, connected) {
        const key = `${row},${col}`;
        if (connected.has(key)) return;
        connected.add(key);
        const neighbors = this.getNeighbors(row, col);
        for (let n of neighbors) this.markConnected(n.row, n.col, connected);
    },

    showBubbleEnd(won) {
        this.bubbleActive = false;
        if (this.bubbleTimerInterval) clearInterval(this.bubbleTimerInterval);
        const overlay = document.getElementById('bubble-overlay');
        const statusText = document.getElementById('bubble-status-text');
        if (overlay && statusText) {
            overlay.classList.remove('hidden');
            statusText.innerText = won ? 'STRÅLANDE! 🎉🔵\nDu är en mästare! 🏆' : 'BUBBLORNA VANN! 👻\nFörsök igen!';
            statusText.style.color = won ? '#F1C40F' : '#E74C3C';
        }
        if (won) { this.state.score += 200; this.incrementProgress(); this.saveState(); }
    }
});
