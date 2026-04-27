Object.assign(App.prototype, {
    initFishingGame() {
        const div = this.screens['game-fishing'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="background: linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%); min-height: 560px; text-align: center; position: relative; overflow: hidden; border: 8px solid #01579B;">
                <!-- Water Surface/Bubbles -->
                <div id="water-fx" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.3;"></div>
                
                <div style="position: absolute; top: 20px; left: 20px; z-index: 10;">
                    ${this.getBackButton('letter-menu')}
                </div>

                <div id="fishing-mission" style="background: white; padding: 15px 30px; border-radius: 25px; display: inline-block; box-shadow: 0 10px 20px rgba(0,0,0,0.2); margin-top: 20px; border: 4px solid #0288D1;">
                    <h2 id="fishing-target-text" style="color: #0277BD; margin: 0; font-size: 1.8rem;">Fiska upp alla: <span style="font-size: 3.5rem; color: #E91E63;">A</span></h2>
                </div>

                <!-- Collection Basket -->
                <div id="fishing-basket" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.8); padding: 10px; border-radius: 20px; min-width: 60px; min-height: 60px; display: flex; gap: 5px; align-items: center; border: 3px solid #0288D1; z-index: 10;">
                    <span style="font-size: 1.5rem; margin-right: 5px;">🧺</span>
                    <div id="basket-items" style="display: flex; gap: 2px;"></div>
                </div>

                <div id="fishing-area" style="position: relative; width: 100%; height: 400px; margin-top: 20px; cursor: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 style=%22font-size:30px%22><text y=%2230%22>🎣</text></svg>'), auto;">
                    <!-- Fish/Letters will spawn here -->
                </div>

                <div id="fishing-boat" style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 6rem; z-index: 5;">🛶</div>
            </div>
            ${this.getCheerleader()}
        `;

        this.fishingActive = true;
        this.nextFishingRound();
    },

    nextFishingRound() {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
        const lower = "abcdefghijklmnopqrstuvwxyzåäö";
        const all = upper + lower;
        this.fishingTarget = all[Math.floor(Math.random() * all.length)];
        
        // Trick letters that look similar to the target
        const similarLetters = {
            'A': 'V4R', 'B': '8PR3', 'C': 'GO0', 'D': 'O0U', 'E': 'F3L', 'F': 'EP', 'G': 'C6O', 'H': 'NKM', 'I': '1L|J', 
            'J': 'IL', 'K': 'HX', 'L': 'I1', 'M': 'NWH', 'N': 'MHV', 'O': 'Q0CD', 'P': 'BR', 'Q': 'O0', 'R': 'BPK', 
            'S': '58', 'T': '7I', 'U': 'V', 'V': 'UAY', 'W': 'MV', 'X': 'KY', 'Y': 'VX', 'Z': '2', 'Å': 'AÄ', 'Ä': 'AÅ', 'Ö': 'O'
        };
        
        this.fishingCount = 0;
        this.fishingNeeded = 2 + Math.floor(Math.random() * 4);

        const targetText = document.getElementById('fishing-target-text');
        if (targetText) {
            targetText.innerHTML = `Fiska upp alla: <span style="font-size: 3.5rem; color: #E91E63; font-weight: 900; text-shadow: 2px 2px 0 white;">${this.fishingTarget}</span> 
            <span id="fishing-progress" style="font-size: 1.5rem; color: #0277BD; margin-left: 10px;">(0 av ${this.fishingNeeded})</span>`;
        }

        const area = document.getElementById('fishing-area');
        const basket = document.getElementById('basket-items');
        if (area) area.innerHTML = '';
        if (basket) basket.innerHTML = '';

        const targetBase = this.fishingTarget.toUpperCase();
        const tricks = similarLetters[targetBase] || "XYZ";

        // Spawn targets and distractors
        for (let i = 0; i < 20; i++) {
            const isTarget = i < this.fishingNeeded;
            let char;
            if (isTarget) {
                char = Math.random() > 0.5 ? this.fishingTarget.toUpperCase() : this.fishingTarget.toLowerCase();
            } else if (i < 12) {
                char = tricks[Math.floor(Math.random() * tricks.length)];
                if (Math.random() > 0.5) char = char.toLowerCase();
            } else {
                char = all[Math.floor(Math.random() * all.length)];
            }
            this.spawnFish(char, isTarget);
        }
    },

    spawnFish(char, isTarget) {
        const area = document.getElementById('fishing-area');
        if (!area) return;

        const fish = document.createElement('div');
        fish.className = 'fish-item';
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 60 + 20;
        
        // Multi-directional speed - slowed down
        let speedX = (0.3 + Math.random() * 0.6 + (this.state.difficulty * 0.1)) * (Math.random() > 0.5 ? 1 : -1);
        let speedY = (0.15 + Math.random() * 0.3 + (this.state.difficulty * 0.05)) * (Math.random() > 0.5 ? 1 : -1);
        const baseSize = 3.5 + Math.random() * 3; // Random size between 3.5rem and 6.5rem

        fish.innerHTML = `
            <div style="position: relative; font-size: ${baseSize}rem; cursor: pointer; transition: transform 0.2s; display: inline-block;">
                <span class="fish-body" style="display: block; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3)); transition: transform 0.2s;">🐟</span>
                <span class="fish-char" style="position: absolute; top: 50%; left: 45%; transform: translate(-50%, -50%); font-size: ${baseSize * 0.45}rem; font-weight: 900; color: #E91E63; font-family: 'Outfit', sans-serif; text-shadow: 0 0 5px white, 0 0 10px white; z-index: 5;">${char}</span>
            </div>
        `;

        fish.style.cssText = `
            position: absolute; left: ${x}%; top: ${y}%; z-index: 2; transition: transform 0.2s; user-select: none;
        `;

        let posX = x;
        let posY = y;
        const body = fish.querySelector('.fish-body');

        const move = () => {
            if (!this.fishingActive || !fish.parentNode) return;
            
            posX += speedX * 0.1;
            posY += speedY * 0.1;

            if (posX > 90) speedX = -Math.abs(speedX);
            if (posX < 5) speedX = Math.abs(speedX);
            if (posY > 85) speedY = -Math.abs(speedY);
            if (posY < 15) speedY = Math.abs(speedY);
            
            fish.style.left = posX + '%';
            fish.style.top = posY + '%';
            if (body) body.style.transform = `scaleX(${speedX > 0 ? -1 : 1})`; 
            
            requestAnimationFrame(move);
        };
        requestAnimationFrame(move);

        fish.onclick = () => {
            const isMatch = char.toLowerCase() === this.fishingTarget.toLowerCase();
            if (isMatch) {
                fish.style.transform += ' scale(2)';
                fish.style.opacity = '0';
                setTimeout(() => fish.remove(), 200);
                this.fishingCount++;
                this.addScore(10);
                this.showToast('NAPP! 🎣✨', 600);
                
                const progressEl = document.getElementById('fishing-progress');
                if (progressEl) progressEl.innerText = `(${this.fishingCount} av ${this.fishingNeeded})`;

                const basket = document.getElementById('basket-items');
                if (basket) {
                    const item = document.createElement('span');
                    item.innerText = '🐟';
                    item.style.fontSize = '1.5rem';
                    item.style.animation = 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    basket.appendChild(item);
                }
                
                if (this.fishingCount >= this.fishingNeeded) {
                    this.showToast('ALLA FÅNGADE! 🏆🐟', 1500);
                    this.incrementProgress();
                    this.cheer('jump');
                    setTimeout(() => this.nextFishingRound(), 2000);
                }
            } else {
                // Scary Piranha Transformation
                const fishEmoji = fish.querySelector('span:first-child');
                const charEl = fish.querySelector('span:last-child');
                if (fishEmoji) {
                    fishEmoji.innerText = '🐡'; // Pufferfish/Piranha look
                    fishEmoji.style.filter = 'drop-shadow(0 0 10px red) hue-rotate(300deg)';
                }
                if (charEl) charEl.style.color = 'red';
                
                this.showToast('OJSAN! En piraya! 🦈👹', 800);
                
                // Bite animation
                fish.style.transition = 'transform 0.1s';
                fish.style.transform = `scale(2.5) scaleX(${moveDir * -1.5})`;
                setTimeout(() => {
                    fish.style.transform = `scale(1) scaleX(${moveDir * -1})`;
                }, 150);

                fish.style.animation = 'shake 0.5s infinite';
                this.addScore(-5);
                
                setTimeout(() => {
                    if (fish.parentNode) {
                        fish.style.animation = '';
                        if (fishEmoji) {
                            fishEmoji.innerText = '🐟';
                            fishEmoji.style.filter = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))';
                        }
                        if (charEl) charEl.style.color = '#01579B';
                    }
                }, 2000);
            }
        };
 
        area.appendChild(fish);
    }
});
