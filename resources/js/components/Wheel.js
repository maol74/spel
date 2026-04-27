Object.assign(App.prototype, {
    renderWheelScreen() {
        const div = this.screens['wheel-screen'];
        const canSpin = this.checkCanSpin();
        
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 600px; margin: 40px auto; padding: 40px; text-align: center; position: relative; overflow: hidden;">
                <h1 style="color: #F1C40F; margin-bottom: 10px;">Dagens Lyckohjul 🎡</h1>
                <p style="color: #A0AEC0; margin-bottom: 40px;">Snurra och vinn stjärnor!</p>

                <div id="wheel-outer" style="width: 100%; height: 400px; position: relative; margin: 20px 0; overflow: visible;">
                    <div id="wheel-container" style="position: absolute; width: 900px; height: 900px; left: 50%; top: 50%; transform: translate(-50%, -50%); pointer-events: none;">
                        <div id="wheel-rotator" style="width: 100%; height: 100%; pointer-events: auto;">
                            <svg viewBox="-100 -100 300 300" style="width: 100%; height: 100%; transform: rotate(-112.5deg); overflow: visible;">
                                <circle cx="50" cy="50" r="48" fill="#2D3748" stroke="#4A5568" stroke-width="2" />
                                ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `
                                    <path d="M50,50 L${50 + 48 * Math.cos(i * Math.PI / 4)},${50 + 48 * Math.sin(i * Math.PI / 4)} A48,48 0 0,1 ${50 + 48 * Math.cos((i + 1) * Math.PI / 4)},${50 + 48 * Math.sin((i + 1) * Math.PI / 4)} Z" 
                                          fill="${i % 2 === 0 ? '#3498DB' : '#2980B9'}" stroke="#1A202C" stroke-width="0.5" />
                                    <!-- Prize Number -->
                                    <text x="${50 + 38 * Math.cos((i + 0.5) * Math.PI / 4)}" y="${50 + 38 * Math.sin((i + 0.5) * Math.PI / 4)}" 
                                          fill="white" font-size="6" font-weight="bold" text-anchor="middle" dominant-baseline="middle" transform="rotate(${(i + 0.5) * 45 + 90}, ${50 + 38 * Math.cos((i + 0.5) * Math.PI / 4)}, ${50 + 38 * Math.sin((i + 0.5) * Math.PI / 4)})">
                                        ${[10, 20, 50, 10, 150, 25, 10, 50][i]}
                                    </text>
                                    <!-- Avatar Icon -->
                                    <text id="wheel-avatar-${i}" x="${50 + 20 * Math.cos((i + 0.5) * Math.PI / 4)}" y="${50 + 20 * Math.sin((i + 0.5) * Math.PI / 4)}" 
                                          font-size="15" text-anchor="middle" dominant-baseline="middle" transform="rotate(${(i + 0.5) * 45 + 90}, ${50 + 20 * Math.cos((i + 0.5) * Math.PI / 4)}, ${50 + 20 * Math.sin((i + 0.5) * Math.PI / 4)})">
                                        ${CONFIG.avatars[i % CONFIG.avatars.length].icon}
                                    </text>
                                `).join('')}
                            </svg>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: white; border-radius: 50%; border: 4px solid #F1C40F; box-shadow: 0 0 20px rgba(0,0,0,0.5); z-index: 5; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">⭐</div>
                        </div>
                        
                        <!-- Red Pointer Arrow (Fixed) -->
                        <div style="position: absolute; top: 290px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 30px solid #E74C3C; z-index: 10; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.5));"></div>
                    </div>
                </div>

                <div id="wheel-controls" style="position: relative; z-index: 20;">
                    ${canSpin ? `
                        <button class="menu-card" style="width: auto; padding: 20px 60px; font-size: 1.8rem; background: var(--color-william); color: white;" onclick="window.gameApp.spinWheel()">SNURRA! 🚀</button>
                    ` : `
                        <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 20px; color: #A0AEC0;">
                            <div style="font-size: 2rem; margin-bottom: 10px;">😴</div>
                            Kom tillbaka imorgon för ett nytt snurr!
                        </div>
                        <button class="menu-card" style="width: auto; padding: 10px 30px; margin-top: 20px; background: #718096;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka</button>
                    `}
                </div>
            </div>
            ${this.getCheerleader()}
        `;
    },

    checkCanSpin() {
        const lastSpin = this.state.lastSpinDate;
        const today = new Date().toDateString();
        return lastSpin !== today;
    },

    spinWheel() {
        if (!this.checkCanSpin()) return;
        
        const rotator = document.getElementById('wheel-rotator');
        const controls = document.getElementById('wheel-controls');
        if (!rotator || !controls) return;
        
        // Disable controls during spin
        controls.innerHTML = '<div style="font-size: 1.5rem; color: #F1C40F; font-weight: bold; animation: pulse 1s infinite;">Snurrar... 🍀</div>';
        
        const segments = [10, 20, 50, 10, 150, 25, 10, 50];
        const randomIndex = Math.floor(Math.random() * segments.length);
        const prize = segments[randomIndex];
        
        // Use CSS transitions for truly smooth and random stop
        // Random number of full spins (5-10) plus the segment offset
        const fullSpins = 5 + Math.floor(Math.random() * 5);
        const targetRotation = (fullSpins * 360) + (randomIndex * 45);
        
        rotator.style.transition = 'transform 5s cubic-bezier(0.15, 0, 0.15, 1)';
        rotator.style.transform = `rotate(${targetRotation}deg)`;
        
        // Special effect: expand avatars during spin
        const baseRadius = 20;
        const expandedRadius = 60;
        for (let i = 0; i < 8; i++) {
            const avatar = document.getElementById(`wheel-avatar-${i}`);
            if (avatar) {
                avatar.style.transition = 'all 2s ease-out';
                const angle = (i + 0.5) * Math.PI / 4;
                const x = 50 + expandedRadius * Math.cos(angle);
                const y = 50 + expandedRadius * Math.sin(angle);
                avatar.setAttribute('x', x);
                avatar.setAttribute('y', y);
                avatar.setAttribute('transform', `rotate(${(i + 0.5) * 45 + 90}, ${x}, ${y})`);
            }
        }

        setTimeout(() => {
            // Reset avatars to base position
            for (let i = 0; i < 8; i++) {
                const avatar = document.getElementById(`wheel-avatar-${i}`);
                if (avatar) {
                    avatar.style.transition = 'all 1s ease-in';
                    const angle = (i + 0.5) * Math.PI / 4;
                    const x = 50 + baseRadius * Math.cos(angle);
                    const y = 50 + baseRadius * Math.sin(angle);
                    avatar.setAttribute('x', x);
                    avatar.setAttribute('y', y);
                    avatar.setAttribute('transform', `rotate(${(i + 0.5) * 45 + 90}, ${x}, ${y})`);
                }
            }

            this.state.lastSpinDate = new Date().toDateString();
            this.addScore(prize);
            this.saveState();
            
            controls.innerHTML = `
                <div style="animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🎉 WOOHOO! 🎉</div>
                    <div style="font-size: 1.5rem; color: #F1C40F; font-weight: bold; margin-bottom: 20px;">Du vann ${prize} stjärnor!</div>
                    <button class="menu-card" style="width: auto; padding: 10px 40px;" onclick="window.gameApp.showScreen('main-menu')">Tack! 🏠</button>
                </div>
            `;
            this.showToast(`GRATTIS! +${prize} ⭐`, 3000);
        }, 5100);
    }
});
