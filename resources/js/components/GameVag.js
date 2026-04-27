Object.assign(App.prototype, {
    initVagGame() {
        const div = this.screens['game-vag'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 900px; margin: 20px auto; padding: 40px; text-align: center;">
                <h1 style="color: #2ECC71; margin-bottom: 40px;">Våg-Spelet ⚖️</h1>
                
                <div id="vag-container" style="position: relative; height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; margin-bottom: 50px;">
                    <!-- Balance Scale -->
                    <div id="vag-beam" style="width: 500px; height: 10px; background: #718096; position: relative; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 5px;">
                        <!-- Left Pan -->
                        <div id="vag-pan-left" style="position: absolute; left: -20px; top: 10px; width: 120px; height: 100px; border: 4px solid #718096; border-top: none; border-radius: 0 0 60px 60px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05);">
                            <div id="vag-left-val" style="font-size: 3rem; font-weight: bold; color: white;">?</div>
                        </div>
                        <!-- Right Pan -->
                        <div id="vag-pan-right" style="position: absolute; right: -20px; top: 10px; width: 120px; height: 100px; border: 4px solid #718096; border-top: none; border-radius: 0 0 60px 60px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05);">
                            <div id="vag-right-val" style="font-size: 3rem; font-weight: bold; color: white;">?</div>
                        </div>
                    </div>
                    <!-- Stand -->
                    <div style="width: 20px; height: 150px; background: #4A5568; border-radius: 10px 10px 0 0;"></div>
                    <div style="width: 200px; height: 10px; background: #2D3748; border-radius: 5px;"></div>
                </div>

                <div id="vag-equation" style="font-size: 2.5rem; margin-bottom: 40px; font-weight: bold; color: #CBD5E0;">
                    <span id="eq-left">5</span> = <span id="eq-right-base">2</span> + <span id="eq-target" style="color: #F1C40F; border-bottom: 4px dashed #F1C40F; min-width: 40px; display: inline-block;">?</span>
                </div>

                <div id="vag-options" style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;"></div>

                <div style="margin-top: 50px;">
                    <button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('math-menu')">Tillbaka</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.nextVagRound();
    },

    nextVagRound() {
        const leftValEl = document.getElementById('vag-left-val');
        const rightValEl = document.getElementById('vag-right-val');
        const eqLeft = document.getElementById('eq-left');
        const eqRightBase = document.getElementById('eq-right-base');
        const eqTarget = document.getElementById('eq-target');
        const beam = document.getElementById('vag-beam');
        const optionsEl = document.getElementById('vag-options');
        if (!leftValEl || !rightValEl || !eqLeft || !eqRightBase || !eqTarget || !beam || !optionsEl) return;

        // Reset beam
        beam.style.transform = 'rotate(10deg)'; // Start unbalanced
        eqTarget.innerText = '?';

        // Generate problem based on difficulty
        const max = this.state.difficulty * 10;
        const total = Math.floor(Math.random() * (max - 2)) + 2;
        const partA = Math.floor(Math.random() * (total - 1)) + 1;
        const correct = total - partA;

        this._vagCorrect = correct;
        this._vagTotal = total;
        this._vagPartA = partA;

        leftValEl.innerText = total;
        rightValEl.innerText = partA;
        eqLeft.innerText = total;
        eqRightBase.innerText = partA;

        // Options
        const options = [correct];
        while (options.length < 5) {
            const rand = Math.floor(Math.random() * max);
            if (!options.includes(rand)) options.push(rand);
        }
        options.sort((a, b) => a - b);

        optionsEl.innerHTML = options.map(val => `
            <div class="vag-option" onclick="window.gameApp.checkVag(${val})" 
                 style="width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; 
                        background: #2D3748; border: 4px solid #4A5568; border-radius: 20px; font-size: 2rem; 
                        font-weight: bold; color: white; cursor: pointer; transition: all 0.2s;">
                ${val}
            </div>
        `).join('');
    },

    checkVag(val) {
        const beam = document.getElementById('vag-beam');
        const eqTarget = document.getElementById('eq-target');
        const rightValEl = document.getElementById('vag-right-val');
        
        if (val === this._vagCorrect) {
            // Animate balance
            beam.style.transform = 'rotate(0deg)';
            eqTarget.innerText = val;
            eqTarget.style.color = '#2ECC71';
            rightValEl.innerText = this._vagTotal;
            
            this.showToast('BALANS! 🌟⚖️✨', 1500);
            this.addScore(4);
            this.incrementProgress();
            this.cheer('jump');
            
            const options = document.querySelectorAll('.vag-option');
            options.forEach(opt => {
                if (parseInt(opt.innerText) === val) {
                    opt.style.background = '#2ECC71';
                    opt.style.borderColor = '#27AE60';
                } else {
                    opt.style.opacity = '0.3';
                }
            });

            setTimeout(() => this.nextVagRound(), 2500);
        } else {
            // Animate even more tilt
            beam.style.transform = val > this._vagCorrect ? 'rotate(-20deg)' : 'rotate(20deg)';
            this.showToast('Hoppsan! Nu blev det snett. 😅', 1000);
            
            const options = document.querySelectorAll('.vag-option');
            options.forEach(opt => {
                if (parseInt(opt.innerText) === val) {
                    opt.style.background = '#E74C3C';
                    opt.style.borderColor = '#C0392B';
                    opt.style.transform = 'translateY(10px)';
                    setTimeout(() => opt.style.transform = '', 200);
                }
            });
        }
    }
});
