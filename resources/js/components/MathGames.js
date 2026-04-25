Object.assign(App.prototype, {
    initMathGame(mode = null) {
        this._initializingMath = true;
        if (!mode) {
            const enabled = this.config.math.penguinModes || ['count'];
            mode = enabled[Math.floor(Math.random() * enabled.length)];
        }
        this.mathMode = mode;
        const div = this.screens['game-math-penguin'];
        const count = this.config.math.penguinMaxBase;
        this.mathTargets = [];
        const maxRes = (this.config.math.maxResults && this.config.math.maxResults[mode]) || 20;
        for (let i = 0; i < count; i++) {
            let num;
            do {
                num = Math.floor(Math.random() * maxRes) + 1;
            } while (this.mathTargets.includes(num));
            this.mathTargets.push(num);
        }
        this.mathIndex = 0;
        this.currentMathNum = this.mathTargets[0];
        this.mathMax = Math.max(...this.mathTargets, count + 5);
        
        const icebergs = [];
        for (let i = 1; i <= this.mathMax; i++) {
            let x, y;
            let overlapping;
            let attempts = 0;
            do {
                overlapping = false;
                x = 5 + (Math.random() * 85);
                y = 10 + (Math.random() * 75);
                for (let existing of icebergs) {
                    const dx = existing.x - x;
                    const dy = existing.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 10) { // roughly 10% distance threshold
                        overlapping = true;
                        break;
                    }
                }
                attempts++;
            } while (overlapping && attempts < 50);

            icebergs.push({ num: i, x: x, y: y });
        }

        const modeTitles = { 'count': 'Räkna', 'add': 'Plus (+)', 'sub': 'Minus (-)', 'mult': 'Gånger (x)' };
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="background: linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%); min-height: 520px;">
                <h2 style="color: #1565C0; margin-bottom: 5px;">Pingvinhopp: ${modeTitles[mode]} 🐧</h2>
                <div id="math-problem-box" style="background: white; padding: 10px 20px; border-radius: 20px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 10px;">
                    <p style="color: #1565C0; font-weight: bold; font-size: 1.2rem; margin:0;">Hitta svaret på: <span id="math-target-text" style="font-size: 2.2rem; color: #E91E63;">...</span></p>
                </div>
                <div id="ice-area" style="position: relative; width: 100%; height: 420px; background: rgba(255,255,255,0.3); border-radius: 20px; overflow: hidden; border: 3px solid #90CAF9; box-shadow: inset 0 0 50px rgba(255,255,255,0.5);">
                    <div id="penguin" style="position: absolute; font-size: 3.5rem; transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 10; left: 10px; bottom: 10px;">🐧</div>
                    <div id="fish" style="position: absolute; font-size: 3.5rem; right: 20px; top: 20px;">🐟</div>
                    ${icebergs.map(ice => `
                        <div class="math-iceberg" id="ice-${ice.num}" style="position: absolute; left: ${ice.x}%; top: ${ice.y}%; cursor: pointer;" onclick="window.gameApp.handleMathClick(${ice.num})">
                            <div style="font-size: 4rem;">🧊</div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 900; color: #D32F2F; font-size: 1.75rem; text-shadow: -1.5px -1.5px 0 #FFD700, 1.5px -1.5px 0 #FFD700, -1.5px 1.5px 0 #FFD700, 1.5px 1.5px 0 #FFD700, 0 0 8px rgba(255, 215, 0, 0.4); pointer-events: none;">
                                ${ice.num}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        icebergs.forEach(ice => {
            const el = document.getElementById(`ice-${ice.num}`);
            if (el) this.makeDraggable(el);
        });
        this.updateMathProblem();
        this.showScreen('game-math-penguin', true);
        this._initializingMath = false;
    },

    updateMathProblem() {
        const target = this.currentMathNum;
        if (target === undefined || target === null) return;
        const mode = this.mathMode;
        let text = target;
        if (mode === 'add') {
            const x = Math.floor(Math.random() * target);
            const y = target - x;
            text = `${x} + ${y}`;
        } else if (mode === 'sub') {
            const y = Math.floor(Math.random() * 10) + 1;
            const x = target + y;
            text = `${x} - ${y}`;
        } else if (mode === 'mult') {
            let factors = [];
            for (let i = 1; i <= target; i++) { if (target % i === 0) factors.push(i); }
            const f1 = factors[Math.floor(Math.random() * factors.length)];
            const f2 = target / f1;
            text = `${f1} × ${f2}`;
        }
        const el = document.getElementById('math-target-text');
        if (el) el.innerText = text;
    },

    handleMathClick(num) {
        if (num === this.currentMathNum) {
            const penguin = document.getElementById('penguin');
            const ice = document.getElementById(`ice-${num}`);
            if (!penguin || !ice) return;
            const rect = ice.getBoundingClientRect();
            const areaRect = document.getElementById('ice-area').getBoundingClientRect();
            penguin.style.left = (rect.left - areaRect.left + 15) + 'px';
            penguin.style.top = (rect.top - areaRect.top - 25) + 'px';
            this.mathIndex++;
            const m = this.mathMode === 'sub' ? 2 : (this.mathMode === 'mult' ? 3 : 1);
            this.addScore(1 * m);
            if (this.mathIndex >= this.mathTargets.length) {
                penguin.style.left = '85%';
                penguin.style.top = '10%';
                setTimeout(() => {
                    this.showToast('BRA RÄKNAT! 🐟🐧');
                    this.addScore(5 * m);
                    this.incrementProgress();
                    setTimeout(() => this.showScreen('penguin-menu'), 3000);
                }, 600);
            } else {
                this.currentMathNum = this.mathTargets[this.mathIndex];
                setTimeout(() => this.updateMathProblem(), 600);
            }
        } else {
            this.showToast('Hoppsan! Prova igen.', 800);
        }
    },

    initMathFeedGame(mode = null) {
        this._initializingFeed = true;
        const div = this.screens['game-math-feed'];
        if (!mode) {
            const enabled = this.config.math.feedModes || ['count'];
            mode = enabled[Math.floor(Math.random() * enabled.length)];
        }
        this.feedMode = mode;
        const maxRes = (this.config.math.maxResults && this.config.math.maxResults[mode]) || 10;
        if (mode === 'add') {
            target = Math.floor(Math.random() * (maxRes - 1)) + 2; // Min result 2
            const x = Math.floor(Math.random() * (target - 1)) + 1;
            const y = target - x;
            problemText = `${x} + ${y}`;
        } else if (mode === 'sub') {
            const y = Math.floor(Math.random() * 9) + 1;
            target = Math.floor(Math.random() * maxRes) + 1;
            const x = target + y;
            problemText = `${x} - ${y}`;
        } else if (mode === 'mult') {
            // Find possible multiplications where result <= maxRes
            let pairs = [];
            for (let i = 1; i <= 10; i++) {
                for (let j = 1; j <= 10; j++) {
                    if (i * j <= maxRes) pairs.push([i, j]);
                }
            }
            if (pairs.length === 0) pairs = [[1, 1]];
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            target = pair[0] * pair[1];
            problemText = `${pair[0]} × ${pair[1]}`;
        } else {
            target = Math.floor(Math.random() * maxRes) + 2;
            problemText = target.toString();
        }
        const animals = ['🐒', '🐘', '🦒', '🦓', '🐼', '🦁'];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const food = animal === '🐒' ? '🍌' : (animal === '🐘' ? '🥜' : (animal === '🐼' ? '🎋' : '🍎'));
        this.feedTarget = target;
        this.feedCount = 0;
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="background: #FFF9C4; min-height: 560px; text-align: center; position: relative; overflow: hidden;">
                <h2 style="color: #E67E22; margin-top: 10px;">Mata Djuren! 🍎</h2>
                <div class="math-problem-box" style="background: white; display: inline-block; padding: 20px 40px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 20px; border: 4px solid #E67E22;">
                    <p style="font-size: 1.8rem; color: #5D4037; font-weight: bold; margin:0;">Hjälp ${animal}! Räkna ut:</p>
                    <div style="font-size: 4rem; color: #E67E22; font-weight: 900; margin: 10px 0;">${problemText}</div>
                    <p style="font-size: 1.2rem; color: #8D6E63; margin:0;">Ge rätt antal ${food}!</p>
                </div>
                
                <div id="animal-target-container" style="display: flex; align-items: center; justify-content: center; gap: 40px; margin: 20px auto;">
                    <button class="menu-card" style="width: 80px; height: 80px; border-radius: 50%; background: #FF6B6B; border: none; font-size: 2.5rem; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.2);" onclick="window.gameApp.removeFoodFromAnimal()">⬅️</button>
                    
                    <div id="animal-target" style="position: relative; font-size: 10rem; width: 220px; height: 220px; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.4); border-radius: 50%; border: 4px dashed #E67E22;">
                        ${animal}
                        <div id="animal-counter" style="position: absolute; bottom: 0; right: 0; background: #E67E22; color: white; width: 60px; height: 60px; border-radius: 50%; font-size: 2rem; display: flex; justify-content: center; align-items: center; font-weight: bold; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">0</div>
                    </div>

                    <button class="menu-card" style="width: 80px; height: 80px; border-radius: 50%; background: #2ECC71; border: none; font-size: 2.5rem; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 5px 15px rgba(0,0,0,0.2);" onclick="window.gameApp.addFoodToAnimal('${food}')">➡️</button>
                </div>

                <div style="position: absolute; right: 40px; bottom: 40px; display: flex; flex-direction: column; gap: 15px;">
                    <button class="menu-card" style="width: auto; padding: 15px 40px; background: #E67E22; border: none; color: white;" onclick="window.gameApp.checkFeed()">Mata! 😋</button>
                    <button class="menu-card" style="width: auto; padding: 10px 20px; border-color: #95A5A6;" onclick="window.gameApp.showScreen('feed-menu')">Tillbaka</button>
                </div>
                <div id="fed-count-display" style="position: absolute; top: 20px; right: 40px; background: rgba(255,255,255,0.8); padding: 10px 20px; border-radius: 15px;">
                    I magen: <span id="fed-total">0</span>
                </div>
            </div>
        `;
        this.showScreen('game-math-feed', true);
        this._initializingFeed = false;
    },

    updateFeedCounters() {
        const totalEl = document.getElementById('fed-total');
        const counterEl = document.getElementById('animal-counter');
        if (totalEl) totalEl.innerText = this.feedCount;
        if (counterEl) counterEl.innerText = this.feedCount;
    },
    addFoodToAnimal(icon) {
        this.feedCount++;
        this.updateFeedCounters();
        const target = document.getElementById('animal-target');
        const pop = document.createElement('div');
        pop.className = 'food-item';
        pop.innerText = icon;
        pop.style.cssText = `position: absolute; font-size: 2.5rem; left: ${Math.random()*70 + 5}%; top: ${Math.random()*70 + 5}%; transition: all 0.2s; pointer-events: none;`;
        target.appendChild(pop);
    },

    removeFoodFromAnimal() {
        if (this.feedCount <= 0) return;
        this.feedCount--;
        this.updateFeedCounters();
        const target = document.getElementById('animal-target');
        const items = target.querySelectorAll('.food-item');
        if (items.length > 0) {
            const last = items[items.length - 1];
            last.style.transform = 'scale(0)';
            setTimeout(() => last.remove(), 200);
        }
    },

    checkFeed() {
        if (this.feedCount === this.feedTarget) {
            this.showToast('Mums! 😋 GOTT! ❤️'); 
            const m = this.feedMode === 'sub' ? 2 : (this.feedMode === 'mult' ? 3 : 1);
            this.addScore(5 * m);
            this.incrementProgress(); 
            setTimeout(() => this.initMathFeedGame(this.feedMode), 3000);
        } else {
            this.showToast(`Hoppsan! Det blev inte riktigt rätt. Räkna en gång till och prova igen! 🤔`);
        }
    },

    initMathDotsGame(mode = null, round = 1) {
        this._initializingDots = true;
        this.dotsRound = round;
        this.dotsTotal = 10;
        const div = this.screens['game-math-dots'];
        const patterns = [
            { name: 'Stjärna', icon: '⭐', points: [[200, 50], [240, 150], [350, 150], [260, 220], [300, 330], [200, 260], [100, 330], [140, 220], [50, 150], [160, 150]] },
            { name: 'Hus', icon: '🏠', points: [[200, 50], [350, 150], [350, 350], [50, 350], [50, 150]] },
            { name: 'Hjärta', icon: '❤️', points: [[200, 120], [260, 50], [340, 50], [380, 120], [380, 200], [200, 380], [20, 200], [20, 120], [60, 50], [140, 50]] },
            { name: 'Fjäril', icon: '🦋', points: [[200, 200], [350, 50], [380, 200], [350, 350], [200, 250], [50, 350], [20, 200], [50, 50]] },
            { name: 'Moln', icon: '☁️', points: [[100, 250], [100, 180], [180, 130], [280, 130], [350, 180], [350, 250], [280, 300], [180, 300]] },
            { name: 'Gran', icon: '🌲', points: [[200, 50], [300, 150], [250, 150], [330, 250], [270, 250], [350, 350], [50, 350], [130, 250], [70, 250], [150, 150], [100, 150]] },
            { name: 'Båt', icon: '⛵', points: [[100, 250], [150, 350], [300, 350], [350, 250], [220, 250], [220, 50], [120, 200]] },
            { name: 'Sol', icon: '☀️', points: [[200, 100], [270, 130], [300, 200], [270, 270], [200, 300], [130, 270], [100, 200], [130, 130]] },
            { name: 'Smile', icon: '😊', points: [[100, 200], [150, 300], [250, 300], [300, 200]] },
            { name: 'Raket', icon: '🚀', points: [[200, 50], [250, 100], [250, 300], [300, 350], [100, 350], [150, 300], [150, 100]] },
            { name: 'Blomma', icon: '🌸', points: [[200, 150], [250, 100], [300, 150], [350, 200], [300, 250], [250, 300], [200, 250], [150, 300], [100, 250], [50, 200], [100, 150], [150, 100]] },
            { name: 'Fisk', icon: '🐟', points: [[350, 200], [300, 150], [150, 150], [50, 200], [150, 250], [300, 250], [350, 300], [350, 100]] },
            { name: 'Måne', icon: '🌙', points: [[250, 50], [200, 100], [180, 200], [200, 300], [250, 350], [150, 300], [100, 200], [150, 100]] },
            { name: 'Bil', icon: '🚗', points: [[100, 300], [100, 200], [150, 150], [300, 150], [350, 200], [350, 300], [300, 300], [300, 350], [250, 350], [250, 300], [150, 300], [150, 350], [100, 350]] },
            { name: 'Lastbil', icon: '🚚', points: [[50, 300], [50, 150], [250, 150], [250, 200], [350, 200], [350, 300], [300, 300], [300, 350], [250, 350], [250, 300], [100, 300], [100, 350], [50, 350]] },
            { name: 'Fågel', icon: '🐦', points: [[100, 200], [200, 150], [300, 200], [350, 150], [300, 250], [200, 300], [100, 250], [50, 150]] },
            { name: 'Äpple', icon: '🍎', points: [[200, 100], [250, 120], [300, 180], [300, 280], [250, 340], [200, 320], [150, 340], [100, 280], [100, 180], [150, 120], [200, 50]] },
            { name: 'Paraply', icon: '🌂', points: [[200, 50], [350, 200], [220, 200], [220, 350], [150, 350], [180, 200], [50, 200]] },
            { name: 'Present', icon: '🎁', points: [[100, 150], [100, 350], [300, 350], [300, 150], [250, 150], [250, 50], [200, 100], [150, 50], [150, 150]] }
        ];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        this.currentDotsPattern = pattern; 
        this.dotsClicked = [];
        if (!mode) {
            const enabled = this.config.math.dotsModes || ['count'];
            mode = enabled[Math.floor(Math.random() * enabled.length)];
        }
        this.dotsMode = mode;

        const maxRes = (this.config.math.maxResults && this.config.math.maxResults[mode]) || 20;
        const availableValues = [];
        const limit = Math.max(maxRes, pattern.points.length + 5);
        for (let i = 1; i <= limit; i++) availableValues.push(i);
        
        // Ensure we have enough small numbers if maxRes is low
        const pool = availableValues.filter(v => v <= maxRes);
        const backupPool = availableValues.filter(v => v > maxRes);
        
        this.dotValues = [];
        for (let i = 0; i < pattern.points.length; i++) {
            let val;
            if (pool.length > 0) {
                const idx = Math.floor(Math.random() * pool.length);
                val = pool.splice(idx, 1)[0];
            } else {
                const idx = Math.floor(Math.random() * backupPool.length);
                val = backupPool.splice(idx, 1)[0];
            }
            this.dotValues.push(val);
        }

        const distractors = [];
        for (let i = 0; i < 10; i++) {
            const dx = Math.random() * 340 + 30;
            const dy = Math.random() * 340 + 30;
            const tooClose = pattern.points.some(p => Math.sqrt(Math.pow(p[0]-dx, 2) + Math.pow(p[1]-dy, 2)) < 40);
            if (!tooClose) {
                let num;
                do { num = Math.floor(Math.random() * maxRes) + 1; } while (this.dotValues.includes(num));
                distractors.push({ x: dx, y: dy, num });
            }
        }

        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="background: #E8F5E9; min-height: 580px; text-align: center; position: relative;">
                <div id="dots-progress" style="position: absolute; top: 20px; right: 40px; background: white; padding: 10px 20px; border-radius: 20px; color: #2E7D32; font-weight: bold; font-size: 1.2rem; border: 2px solid #4CAF50; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    FIGURER: <span id="dots-round-text">${this.dotsRound}</span> / ${this.dotsTotal}
                </div>
                <h2 style="color: #2E7D32; margin-top: 10px;">Prick till Prick: ${pattern.name}</h2>
                <div id="dots-problem-box" style="background: white; padding: 20px 40px; border-radius: 30px; display: inline-block; border: 4px solid #4CAF50;">
                    <p style="color: #2E7D32; font-weight: bold; font-size: 1.4rem; margin:0;">Vad blir det här?</p>
                    <div id="dots-target-text" style="font-size: 3.5rem; color: #E91E63; font-weight: 900; margin: 10px 0;">...</div>
                </div>
                <div id="dots-area" style="position: relative; width: 400px; height: 400px; margin: 20px auto; background: white; border-radius: 20px; border: 4px solid #A5D6A7;">
                    <svg id="dots-svg" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events: none;"></svg>
                    
                    ${distractors.map((d, i) => `
                        <div class="dot-point distractor" style="position: absolute; left: ${d.x}px; top: ${d.y}px; transform: translate(-50%, -50%);" onclick="window.gameApp.handleFakeDotClick(this)">
                            <div style="width: 35px; height: 35px; background: #FFF; border: 3px solid #4CAF50; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; color: #2E7D32; cursor: pointer;">
                                ${d.num}
                            </div>
                        </div>
                    `).join('')}

                    ${pattern.points.map((p, i) => `
                        <div class="dot-point" id="dot-${i}" style="position: absolute; left: ${p[0]}px; top: ${p[1]}px; transform: translate(-50%, -50%);" onclick="window.gameApp.handleDotClick(${i})">
                            <div style="width: 35px; height: 35px; background: #FFF; border: 3px solid #4CAF50; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; color: #2E7D32; cursor: pointer;">
                                ${this.dotValues[i]}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 20px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('dots-menu')">Tillbaka</button></div>
            </div>
        `;
        this.updateDotsProblem(); this.showScreen('game-math-dots', true); this._initializingDots = false;
    },

    updateDotsProblem() {
        const target = this.dotValues[this.dotsClicked.length];
        if (target === undefined) {
            const el = document.getElementById('dots-target-text');
            if (el) el.innerText = 'KLART! ⭐';
            return;
        }
        const mode = this.dotsMode || 'count';
        let text = target;
        if (mode === 'add') {
            const x = Math.floor(Math.random() * target); const y = target - x; text = `${x} + ${y}`;
        } else if (mode === 'sub') {
            const y = Math.floor(Math.random() * 10) + 1; const x = target + y; text = `${x} - ${y}`;
        } else if (mode === 'mult') {
            let factors = []; for (let i = 1; i <= target; i++) { if (target % i === 0) factors.push(i); }
            const f1 = factors[Math.floor(Math.random() * factors.length)]; const f2 = target / f1; text = `${f1} × ${f2}`;
        }
        const el = document.getElementById('dots-target-text'); if (el) el.innerText = text;
    },

    handleFakeDotClick(el) {
        this.showToast('Hoppsan! Det var inte rätt siffra. 🤔');
        el.style.animation = 'shake 0.5s';
        setTimeout(() => el.style.animation = '', 500);
    },

    handleDotClick(index) {
        if (this.dotsClicked.includes(index)) return;
        if (index === this.dotsClicked.length) {
            this.dotsClicked.push(index);
            const m = this.dotsMode === 'sub' ? 2 : (this.dotsMode === 'mult' ? 3 : 1);
            this.addScore(1 * m);
            const dotEl = document.querySelector(`#dot-${index} > div`);
            if (dotEl) { dotEl.style.background = '#4CAF50'; dotEl.style.color = 'white'; }
            this.updateDotsProblem();
            if (index > 0) {
                const prev = this.currentDotsPattern.points[index - 1]; const cur = this.currentDotsPattern.points[index];
                const svg = document.getElementById('dots-svg');
                if (svg) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', prev[0]); line.setAttribute('y1', prev[1]);
                    line.setAttribute('x2', cur[0]); line.setAttribute('y2', cur[1]);
                    line.setAttribute('stroke', '#4CAF50'); line.setAttribute('stroke-width', '4');
                    svg.appendChild(line);
                }
            }
            if (this.dotsClicked.length === this.currentDotsPattern.points.length) {
                const svg = document.getElementById('dots-svg');
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', this.currentDotsPattern.points[index][0]); line.setAttribute('y1', this.currentDotsPattern.points[index][1]);
                line.setAttribute('x2', this.currentDotsPattern.points[0][0]); line.setAttribute('y2', this.currentDotsPattern.points[0][1]);
                line.setAttribute('stroke', '#4CAF50'); line.setAttribute('stroke-width', '6'); svg.appendChild(line);
                setTimeout(() => { 
                    this.showToast('MAGISKT! ❤️'); 
                    const m = this.dotsMode === 'sub' ? 2 : (this.dotsMode === 'mult' ? 3 : 1);
                    this.addScore(5 * m);
                    this.incrementProgress();
                    
                    if (this.dotsRound < this.dotsTotal) {
                        setTimeout(() => this.initMathDotsGame(this.dotsMode, this.dotsRound + 1), 2000);
                    } else {
                        setTimeout(() => this.showScreen('dots-menu'), 2000); 
                    }
                }, 1000);
            }
        }
    }
});
