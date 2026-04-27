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
                    <h2 id="fishing-target-text" style="color: #0277BD; margin: 0; font-size: 1.8rem;">Fiska upp alla: <span style="font-size: 3rem; color: #E91E63;">A</span></h2>
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
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
        this.fishingTarget = letters[Math.floor(Math.random() * letters.length)];
        const targetText = document.getElementById('fishing-target-text');
        if (targetText) targetText.innerHTML = `Fiska upp alla: <span style="font-size: 3.5rem; color: #E91E63; font-weight: 900; text-shadow: 2px 2px 0 white;">${this.fishingTarget}</span>`;

        const area = document.getElementById('fishing-area');
        area.innerHTML = '';
        this.fishingCount = 0;
        this.fishingNeeded = 3 + Math.floor(this.state.difficulty / 2);

        // Spawn targets and distractors
        for (let i = 0; i < 15; i++) {
            const isTarget = i < this.fishingNeeded;
            this.spawnFish(isTarget ? this.fishingTarget : letters[Math.floor(Math.random() * letters.length)], isTarget);
        }
    },

    spawnFish(char, isTarget) {
        const area = document.getElementById('fishing-area');
        if (!area) return;

        const fish = document.createElement('div');
        fish.className = 'fish-item';
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 60 + 20;
        const speed = 2 + Math.random() * 3 + (this.state.difficulty * 0.5);
        const direction = Math.random() > 0.5 ? 1 : -1;

        fish.innerHTML = `
            <div style="position: relative; font-size: 4rem; cursor: pointer; transition: transform 0.2s; display: inline-block;">
                <span style="display: block; filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.2));">🐟</span>
                <span style="position: absolute; top: 50%; left: 45%; transform: translate(-50%, -50%); font-size: 1.5rem; font-weight: 900; color: #01579B; font-family: 'Outfit', sans-serif;">${char}</span>
            </div>
        `;

        fish.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            z-index: 2;
            transition: transform 0.2s;
            user-select: none;
        `;

        let posX = x;
        let moveDir = direction;

        const move = () => {
            if (!this.fishingActive || !fish.parentNode) return;
            posX += (speed * 0.1) * moveDir;
            if (posX > 90) moveDir = -1;
            if (posX < 5) moveDir = 1;
            
            fish.style.left = posX + '%';
            fish.style.transform = `scaleX(${moveDir * -1})`; // Flip fish
            
            requestAnimationFrame(move);
        };
        requestAnimationFrame(move);

        fish.onclick = () => {
            if (isTarget) {
                fish.style.transform += ' scale(1.5)';
                fish.style.opacity = '0';
                setTimeout(() => fish.remove(), 200);
                this.fishingCount++;
                this.addScore(5);
                this.showToast('NAPP! 🎣✨', 600);
                
                if (this.fishingCount >= this.fishingNeeded) {
                    this.showToast('ALLA FÅNGADE! 🏆🐟', 1500);
                    this.incrementProgress();
                    this.cheer('jump');
                    setTimeout(() => this.nextFishingRound(), 2000);
                }
            } else {
                this.showToast('Fel fisk! 🐡', 500);
                fish.style.animation = 'shake 0.5s';
                setTimeout(() => fish.style.animation = '', 500);
            }
        };

        area.appendChild(fish);
    }
});
