Object.assign(App.prototype, {
    initGameMemory() {
        const div = this.screens['game-memory'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="memory-container" style="position: relative; width: 800px; height: 500px; margin: 0 auto; background: #2D3748; border-radius: 30px; overflow: hidden; border: 5px solid #4A5568; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                
                <div id="memory-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white;">
                    <h1 id="memory-status-text" style="font-size: 3rem; margin-bottom: 20px;">BRA JOBBAT!</h1>
                    <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.5rem;" onclick="window.gameApp.initGameMemory()">Spela Igen! 🔄</button>
                    <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('letter-menu')">Tillbaka till menyn 🏠</button>
                </div>

                <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; z-index: 20;">
                    <div id="memory-score" style="background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 1.2rem; border: 2px solid #F1C40F; backdrop-filter: blur(5px);">
                        PAR: <span id="memory-count">0</span> / <span id="memory-target">0</span>
                    </div>
                </div>

                <div id="memory-grid" style="display: grid; gap: 10px; perspective: 1000px;"></div>
                
                <div style="position: absolute; bottom: 20px; left: 20px; color: #A0AEC0; font-weight: bold; font-size: 0.9rem;">
                    Hitta två likadana bokstäver! 🧠🔤
                </div>
            </div>
            <style>
                .memory-card-obj {
                    width: 80px;
                    height: 100px;
                    background: #4A5568;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    color: white;
                    cursor: pointer;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                    position: relative;
                    border: 3px solid #718096;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                .memory-card-obj.flipped {
                    transform: rotateY(180deg);
                }
                .memory-card-obj .front, .memory-card-obj .back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px;
                }
                .memory-card-obj .back {
                    background: linear-gradient(135deg, #4A5568 0%, #2D3748 100%);
                    font-size: 2.5rem;
                }
                .memory-card-obj .front {
                    background: white;
                    color: #2D3748;
                    transform: rotateY(180deg);
                }
                .memory-card-obj.matched {
                    opacity: 0.6;
                    pointer-events: none;
                    transform: rotateY(180deg) scale(0.95);
                    border-color: #2ECC71;
                }
            </style>
        `;

        this.memoryActive = true;
        this.memoryPairsFound = 0;
        this.memoryFlippedCards = [];
        
        const difficulty = this.state.difficulty; // 1, 2, 3
        const pairsCount = difficulty === 1 ? 4 : (difficulty === 2 ? 6 : 8);
        const gridCols = difficulty === 1 ? 4 : 4;
        
        document.getElementById('memory-target').innerText = pairsCount;
        const grid = document.getElementById('memory-grid');
        grid.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
        
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");
        let selectedLetters = [];
        while(selectedLetters.length < pairsCount) {
            const l = letters[Math.floor(Math.random() * letters.length)];
            if (!selectedLetters.includes(l)) selectedLetters.push(l);
        }
        
        let cards = [...selectedLetters, ...selectedLetters];
        cards.sort(() => Math.random() - 0.5);
        
        grid.innerHTML = cards.map((l, i) => `
            <div class="memory-card-obj" data-letter="${l}" data-index="${i}" onclick="window.gameApp.flipMemoryCard(this)">
                <div class="back">❓</div>
                <div class="front">${l}</div>
            </div>
        `).join('');
    },

    flipMemoryCard(el) {
        if (!this.memoryActive || el.classList.contains('flipped') || el.classList.contains('matched') || this.memoryFlippedCards.length >= 2) return;
        
        el.classList.add('flipped');
        this.memoryFlippedCards.push(el);
        
        if (this.memoryFlippedCards.length === 2) {
            this.checkMemoryMatch();
        }
    },

    checkMemoryMatch() {
        const [c1, c2] = this.memoryFlippedCards;
        const match = c1.dataset.letter === c2.dataset.letter;
        
        if (match) {
            c1.classList.add('matched');
            c2.classList.add('matched');
            this.memoryPairsFound++;
            document.getElementById('memory-count').innerText = this.memoryPairsFound;
            this.memoryFlippedCards = [];
            
            this.showToast('BRA MATCHAT! ✨🔤');
            
            const target = parseInt(document.getElementById('memory-target').innerText);
            if (this.memoryPairsFound >= target) {
                this.showMemoryEnd(true);
            }
        } else {
            setTimeout(() => {
                c1.classList.remove('flipped');
                c2.classList.remove('flipped');
                this.memoryFlippedCards = [];
            }, 1000);
        }
    },

    showMemoryEnd(won) {
        this.memoryActive = false;
        const overlay = document.getElementById('memory-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
        if (won) {
            this.state.score += 50;
            this.incrementProgress();
            this.saveState();
        }
    }
});
