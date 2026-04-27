Object.assign(App.prototype, {
    initVokalGame() {
        const div = this.screens['game-vokal'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 1000px; margin: 20px auto; padding: 20px; position: relative; height: 80vh; overflow: hidden; background: linear-gradient(to bottom, #1A202C, #2D3748);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: relative; z-index: 10;">
                    <h1 style="margin: 0; color: #FF6B6B;">Vokal-Jakten 🎈</h1>
                    <div style="background: rgba(0,0,0,0.4); padding: 10px 20px; border-radius: 20px; font-weight: bold; color: #FF6B6B; font-size: 1.5rem;">
                        Fånga: A E I O U Y Å Ä Ö
                    </div>
                </div>
                
                <div id="vokal-game-area" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: crosshair;"></div>
                
                <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10;">
                    <button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.stopVokalGame()">Tillbaka</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
        
        this.startVokalGame();
    },

    startVokalGame() {
        this.vokalGameActive = true;
        this.vokalSpawnTimer = setInterval(() => this.spawnVokalItem(), 1000 / (this.state.difficulty * 0.5 + 0.5));
    },

    spawnVokalItem() {
        if (!this.vokalGameActive) return;
        const area = document.getElementById('vokal-game-area');
        if (!area) return;

        const vokaler = ['A', 'E', 'I', 'O', 'U', 'Y', 'Å', 'Ä', 'Ö'];
        const konsonanter = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'];
        
        const isVokal = Math.random() > 0.4;
        const char = isVokal ? vokaler[Math.floor(Math.random() * vokaler.length)] : konsonanter[Math.floor(Math.random() * konsonanter.length)];
        
        const item = document.createElement('div');
        item.className = 'vokal-balloon';
        item.innerText = char;
        
        const size = 80 + Math.random() * 40;
        const left = Math.random() * (area.offsetWidth - size);
        
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#2ECC71', '#3498DB', '#9B59B6', '#F1C40F'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        Object.assign(item.style, {
            position: 'absolute',
            bottom: '-100px',
            left: `${left}px`,
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${size * 0.5}px`,
            fontWeight: 'bold',
            color: 'white',
            boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.3)`,
            cursor: 'pointer',
            transition: 'transform 0.1s',
            zIndex: '5'
        });

        // Add balloon string
        const string = document.createElement('div');
        Object.assign(string.style, {
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            width: '2px',
            height: '40px',
            background: 'rgba(255,255,255,0.3)',
            transform: 'translateX(-50%)'
        });
        item.appendChild(string);

        area.appendChild(item);

        const speed = 2 + Math.random() * this.state.difficulty;
        let pos = -100;
        
        const move = () => {
            if (!this.vokalGameActive || !item.parentNode) return;
            pos += speed;
            item.style.bottom = `${pos}px`;
            
            if (pos > area.offsetHeight + 100) {
                item.remove();
            } else {
                requestAnimationFrame(move);
            }
        };
        requestAnimationFrame(move);

        item.onclick = () => {
            if (isVokal) {
                this.addScore(2);
                this.incrementProgress();
                this.showVokalEffect(item, true);
                this.cheer('jump');
            } else {
                this.showVokalEffect(item, false);
                this.showToast('Det där var en konsonant! 🙊', 500);
            }
            item.remove();
        };
    },

    showVokalEffect(el, success) {
        const rect = el.getBoundingClientRect();
        const effect = document.createElement('div');
        effect.innerText = success ? '🌟' : '💨';
        Object.assign(effect.style, {
            position: 'fixed',
            left: `${rect.left + rect.width / 2}px`,
            top: `${rect.top + rect.height / 2}px`,
            fontSize: '3rem',
            pointerEvents: 'none',
            zIndex: '100',
            animation: 'floatUp 0.5s ease-out forwards'
        });
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    },

    stopVokalGame() {
        this.vokalGameActive = false;
        clearInterval(this.vokalSpawnTimer);
        this.showScreen('letter-menu');
    }
});
