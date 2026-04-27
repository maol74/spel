Object.assign(App.prototype, {
    initKlockaGame() {
        this._klockaMode = this._klockaMode || 'analog'; // 'analog' or 'digital'
        const div = this.screens['game-klocka'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 800px; margin: 20px auto; padding: 40px; text-align: center; position: relative; overflow: hidden;">
                <!-- Back Button -->
                <button onclick="window.gameApp.showScreen('math-menu')" 
                        style="position: absolute; top: 20px; left: 20px; z-index: 100; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); color: white; width: 50px; height: 50px; border-radius: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; backdrop-filter: blur(5px);">
                    <span style="font-size: 1.5rem;">⬅️</span>
                </button>

                <!-- Mode Toggle -->
                <button onclick="window.gameApp.toggleKlockaMode()" 
                        style="position: absolute; top: 20px; right: 20px; z-index: 100; background: #3498DB; border: none; color: white; padding: 10px 20px; border-radius: 15px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.2s;">
                    ${this._klockaMode === 'analog' ? 'Visa Digitalt 📱' : 'Visa Analogt 🕒'}
                </button>

                <h1 style="color: #FF6B6B; margin-bottom: 20px;">Klock-Kul ⏰</h1>
                <div id="klocka-container" style="display: flex; flex-direction: column; align-items: center; gap: 30px;">
                    <div style="font-size: 1.5rem; color: #CBD5E0;">${this._klockaMode === 'analog' ? 'Vad är klockan?' : 'Hitta klockan som visar:'}</div>
                    
                    <!-- Analog Display -->
                    <div id="klocka-analog-display" style="display: ${this._klockaMode === 'analog' ? 'block' : 'none'}; width: 300px; height: 300px; border: 12px solid #2D3748; border-radius: 50%; position: relative; background: white; box-shadow: 0 10px 40px rgba(0,0,0,0.4); box-sizing: content-box;">
                        <svg viewBox="0 0 300 300" style="position: absolute; top: 0; left: 0; width: 300px; height: 300px; pointer-events: none;">
                            ${Array(12).fill(0).map((_, i) => {
                                const angle = (i * 30) * (Math.PI / 180);
                                const x1 = 150 + 115 * Math.sin(angle);
                                const y1 = 150 - 115 * Math.cos(angle);
                                const x2 = 150 + 135 * Math.sin(angle);
                                const y2 = 150 - 135 * Math.cos(angle);
                                return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2D3748" stroke-width="6" stroke-linecap="round" />`;
                            }).join('')}
                        </svg>
                        ${[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
                            const angle = (i * 30) * (Math.PI / 180);
                            const x = 150 + 90 * Math.sin(angle);
                            const y = 150 - 90 * Math.cos(angle);
                            return `<div style="position: absolute; left: ${x}px; top: ${y}px; transform: translate(-50%, -50%); font-size: 1.8rem; font-weight: 900; color: #2D3748; font-family: 'Outfit', 'Arial Black', sans-serif;">${n}</div>`;
                        }).join('')}
                        <div id="klocka-hour" style="position: absolute; bottom: 50%; left: 50%; width: 10px; height: 60px; background: #2D3748; border-radius: 5px; transform-origin: bottom center; z-index: 5; transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-left: -5px;"></div>
                        <div id="klocka-minute" style="position: absolute; bottom: 50%; left: 50%; width: 5px; height: 115px; background: #4A5568; border-radius: 3px; transform-origin: bottom center; z-index: 4; transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-left: -2.5px;"></div>
                        <div style="position: absolute; top: 50%; left: 50%; width: 20px; height: 20px; background: #E74C3C; border-radius: 50%; transform: translate(-50%, -50%); z-index: 10; border: 2px solid white;"></div>
                    </div>

                    <!-- Digital Display -->
                    <div id="klocka-digital-display" style="display: ${this._klockaMode === 'digital' ? 'flex' : 'none'}; background: #000; color: #0F0; font-family: 'Courier New', monospace; font-size: 5rem; padding: 20px 40px; border-radius: 15px; border: 4px solid #333; box-shadow: inset 0 0 20px #0F0;">
                        00:00
                    </div>

                    <div id="klocka-options" style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 20px;"></div>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.nextKlockaRound();
    },

    toggleKlockaMode() {
        this._klockaMode = this._klockaMode === 'analog' ? 'digital' : 'analog';
        this.initKlockaGame();
    },

    getSmallClock(h, m, size = 100) {
        const hAngle = (h % 12) * 30 + (m / 2);
        const mAngle = m * 6;
        const scale = size / 300;
        
        return `
            <div style="width: ${size}px; height: ${size}px; border: ${4 * scale}px solid #2D3748; border-radius: 50%; position: relative; background: white; pointer-events: none;">
                <svg viewBox="0 0 300 300" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                    <!-- Ticks -->
                    ${Array(12).fill(0).map((_, i) => {
                        const angle = (i * 30) * (Math.PI / 180);
                        const x1 = 150 + 125 * Math.sin(angle);
                        const y1 = 150 - 125 * Math.cos(angle);
                        const x2 = 150 + 145 * Math.sin(angle);
                        const y2 = 150 - 145 * Math.cos(angle);
                        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2D3748" stroke-width="12" stroke-linecap="round" />`;
                    }).join('')}
                    
                    <!-- Numbers -->
                    ${[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
                        const angle = (i * 30) * (Math.PI / 180);
                        const x = 150 + 95 * Math.sin(angle);
                        const y = 150 - 95 * Math.cos(angle);
                        return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" style="font-size: 45px; font-weight: 900; fill: #2D3748; font-family: Arial, sans-serif;">${n}</text>`;
                    }).join('')}

                    <!-- Hands -->
                    <line x1="150" y1="150" x2="${150 + 70 * Math.sin(hAngle * Math.PI / 180)}" y2="${150 - 70 * Math.cos(hAngle * Math.PI / 180)}" stroke="#2D3748" stroke-width="20" stroke-linecap="round" />
                    <line x1="150" y1="150" x2="${150 + 115 * Math.sin(mAngle * Math.PI / 180)}" y2="${150 - 115 * Math.cos(mAngle * Math.PI / 180)}" stroke="#4A5568" stroke-width="12" stroke-linecap="round" />
                    
                    <!-- Center -->
                    <circle cx="150" cy="150" r="15" fill="#E74C3C" stroke="white" stroke-width="5" />
                </svg>
            </div>
        `;
    },

    nextKlockaRound() {
        const hourHand = document.getElementById('klocka-hour');
        const minuteHand = document.getElementById('klocka-minute');
        const digitalEl = document.getElementById('klocka-digital-display');
        const optionsEl = document.getElementById('klocka-options');
        if (!optionsEl) return;

        this._klockaHistory = this._klockaHistory || [];

        // Generate time
        let h, m, timeStr;
        let attempts = 0;
        do {
            h = Math.floor(Math.random() * 12) + 1;
            m = 0;
            if (this.state.difficulty > 2) {
                const types = [0, 30];
                if (this.state.difficulty > 4) types.push(15, 45);
                m = types[Math.floor(Math.random() * types.length)];
            }
            timeStr = `${h}:${m === 0 ? '00' : m}`;
            attempts++;
        } while (this._klockaHistory.includes(timeStr) && attempts < 20);

        this._klockaTime = timeStr;
        this._klockaHistory.push(timeStr);
        if (this._klockaHistory.length > 8) this._klockaHistory.shift();
        
        if (this._klockaMode === 'analog') {
            const mAngle = m * 6;
            const hAngle = (h % 12) * 30 + (m / 2);
            if (hourHand) hourHand.style.transform = `rotate(${hAngle}deg)`;
            if (minuteHand) minuteHand.style.transform = `rotate(${mAngle}deg)`;
        } else {
            if (digitalEl) digitalEl.innerText = timeStr.padStart(5, '0');
        }

        // Options
        const correctOpt = { h, m, timeStr };
        const options = [correctOpt];
        while (options.length < 4) {
            let rh = Math.floor(Math.random() * 12) + 1;
            let rm = (this.state.difficulty > 2) ? [0, 15, 30, 45][Math.floor(Math.random() * 4)] : 0;
            let rt = `${rh}:${rm === 0 ? '00' : rm}`;
            if (!options.find(o => o.timeStr === rt)) options.push({ h: rh, m: rm, timeStr: rt });
        }
        options.sort((a, b) => a.timeStr.localeCompare(b.timeStr));

        optionsEl.innerHTML = options.map(opt => `
            <div class="klocka-option" onclick="window.gameApp.checkKlocka('${opt.timeStr}')" 
                 style="background: #2D3748; border: 4px solid #4A5568; padding: ${this._klockaMode === 'analog' ? '15px 30px' : '10px'}; border-radius: 20px; 
                        cursor: pointer; transition: all 0.2s; min-width: 120px; display: flex; justify-content: center; align-items: center;">
                ${this._klockaMode === 'analog' ? `<span style="font-size: 2rem; font-weight: bold; color: white;">${opt.timeStr}</span>` : this.getSmallClock(opt.h, opt.m, 120)}
            </div>
        `).join('');
    },

    checkKlocka(picked) {
        if (picked === this._klockaTime) {
            this.showToast('HELT RÄTT! 🌟⏰✨', 1500);
            this.addScore(5);
            this.incrementProgress();
            this.cheer('jump');
            
            const options = document.querySelectorAll('.klocka-option');
            options.forEach(opt => {
                const optText = opt.innerText.trim();
                // In digital mode, we don't have text, so we check the onclick
                const isCorrect = this._klockaMode === 'analog' ? (optText === picked) : opt.getAttribute('onclick').includes(`'${picked}'`);
                
                if (isCorrect) {
                    opt.style.background = '#2ECC71';
                    opt.style.borderColor = '#27AE60';
                } else {
                    opt.style.opacity = '0.3';
                }
            });

            setTimeout(() => this.nextKlockaRound(), 2500);
        } else {
            this.showToast(this._klockaMode === 'analog' ? 'Inte riktigt... titta noga på visarna! 😅' : 'Hoppsan! Titta noga på siffrorna. 😅', 1000);
            const options = document.querySelectorAll('.klocka-option');
            options.forEach(opt => {
                const isPicked = opt.getAttribute('onclick').includes(`'${picked}'`);
                if (isPicked) {
                    opt.style.background = '#E74C3C';
                    opt.style.borderColor = '#C0392B';
                    opt.style.transform = 'translateY(10px)';
                    setTimeout(() => opt.style.transform = '', 200);
                }
            });
        }
    }
});
