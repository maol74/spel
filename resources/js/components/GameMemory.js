Object.assign(App.prototype, {
    initGameMemory(size = 4) {
        this.memoryGridSize = size;
        const div = this.screens['game-memory'];
        div.innerHTML = `
            ${this.getHUD()}
            <div id="memory-container" style="position: relative; width: 800px; height: 600px; margin: 0 auto; background: #2D3748; border-radius: 30px; overflow: hidden; border: 5px solid #4A5568; box-shadow: 0 15px 35px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 20px;">
                
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button class="menu-card ${size === 3 ? 'active-orange' : ''}" style="width: auto; padding: 8px 15px; font-size: 1rem;" onclick="window.gameApp.initGameMemory(3)">3x3</button>
                    <button class="menu-card ${size === 4 ? 'active-orange' : ''}" style="width: auto; padding: 8px 15px; font-size: 1rem;" onclick="window.gameApp.initGameMemory(4)">4x4</button>
                    <button class="menu-card ${size === 5 ? 'active-orange' : ''}" style="width: auto; padding: 8px 15px; font-size: 1rem;" onclick="window.gameApp.initGameMemory(5)">5x5</button>
                    <button class="menu-card ${size === 6 ? 'active-orange' : ''}" style="width: auto; padding: 8px 15px; font-size: 1rem;" onclick="window.gameApp.initGameMemory(6)">6x6</button>
                </div>

                <div id="memory-overlay" class="hidden" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 100; color: white;">
                    <h1 id="memory-status-text" style="font-size: 3rem; margin-bottom: 20px;">BRA JOBBAT!</h1>
                    <button class="menu-card" style="width: auto; padding: 15px 40px; font-size: 1.5rem;" onclick="window.gameApp.initGameMemory(${size})">Spela Igen! 🔄</button>
                    <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('letter-menu')">Tillbaka till menyn 🏠</button>
                </div>

                <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; z-index: 20;">
                    <div id="memory-score" style="background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; font-size: 1.2rem; border: 2px solid #F1C40F; backdrop-filter: blur(5px);">
                        PAR: <span id="memory-count">0</span> / <span id="memory-target">0</span>
                    </div>
                </div>

                <div id="memory-grid" style="display: grid; gap: 10px; perspective: 1000px;"></div>
            </div>
            <style>
                .memory-card-obj {
                    width: ${size > 4 ? '60px' : '80px'};
                    height: ${size > 4 ? '80px' : '100px'};
                    background: #4A5568;
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${size > 4 ? '1.5rem' : '2.5rem'};
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
                    font-size: ${size > 4 ? '1.5rem' : '2.5rem'};
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
        
        const totalCards = size * size;
        const pairsCount = Math.floor(totalCards / 2);
        const hasJoker = totalCards % 2 !== 0;
        
        document.getElementById('memory-target').innerText = pairsCount;
        const grid = document.getElementById('memory-grid');
        grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");
        let selectedLetters = [];
        while(selectedLetters.length < pairsCount) {
            const l = letters[Math.floor(Math.random() * letters.length)];
            if (!selectedLetters.includes(l)) selectedLetters.push(l);
        }
        
        let cards = [...selectedLetters, ...selectedLetters];
        if (hasJoker) cards.push('⭐');
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
