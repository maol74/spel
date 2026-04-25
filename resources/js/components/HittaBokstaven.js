Object.assign(App.prototype, {
    initHittaGame() {
        const div = this.screens['game-hitta'];
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Å', 'Ä', 'Ö'];
        let targetBase;
        const extra = this.config.hitta.extraLetters;
        if (extra && extra.trim() !== '') {
            const list = extra.split(',').map(s => s.trim().toUpperCase()).filter(s => s !== '');
            if (list.length > 0 && Math.random() < 0.7) {
                targetBase = list[Math.floor(Math.random() * list.length)];
            } else {
                targetBase = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        } else {
            targetBase = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        const count = Math.floor(Math.random() * 4) + 2; // Slumpa mellan 2 och 5
        this.lettersToFind = count;
        this.isHittaRotating = this.isHittaRotating || false;
        this.isHittaMoving = this.isHittaMoving || false;
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card">
                <h2 style="color: #4A90E2; text-align:center;">Hitta <span id="hitta-count">${this.lettersToFind}</span> stycken ${targetBase}! (Både ${targetBase} och ${targetBase.toLowerCase()})</h2>
                
                <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                    <button id="hitta-rotate-toggle" class="menu-card" style="width: auto; padding: 10px 30px; background: ${this.isHittaRotating ? '#E74C3C' : '#2ECC71'}; border: none; color: white;" onclick="window.gameApp.toggleHittaRotation()">
                        ${this.isHittaRotating ? 'Rotera inte ⏹️' : 'Rotera 🔄'}
                    </button>
                    <button id="hitta-move-toggle" class="menu-card" style="width: auto; padding: 10px 30px; background: ${this.isHittaMoving ? '#E74C3C' : '#3498DB'}; border: none; color: white;" onclick="window.gameApp.toggleHittaMovement()">
                        ${this.isHittaMoving ? 'Stanna ⏹️' : 'Kör 🏃'}
                    </button>
                </div>

                <div id="hitta-area" class="game-area-dashed"></div>
            </div>
        `;
        const area = div.querySelector('#hitta-area');
        const fullAlphabetString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖabcdefghijklmnopqrstuvwxyzåäö';
        for (let i = 0; i < count; i++) { this.spawnHittaLetter(Math.random() > 0.5 ? targetBase : targetBase.toLowerCase(), true, area); }
        for (let i = 0; i < this.config.hitta.randomCount; i++) {
            const char = fullAlphabetString[Math.floor(Math.random() * fullAlphabetString.length)];
            if (char.toUpperCase() !== targetBase) this.spawnHittaLetter(char, false, area);
        }
        if (this.isHittaMoving) this.startHittaMoveLoop();
    },

    toggleHittaMovement() {
        this.isHittaMoving = !this.isHittaMoving;
        const btn = document.getElementById('hitta-move-toggle');
        if (btn) {
            btn.style.background = this.isHittaMoving ? '#E74C3C' : '#3498DB';
            btn.innerText = this.isHittaMoving ? 'Stanna ⏹️' : 'Kör 🏃';
        }
        if (this.isHittaMoving) this.startHittaMoveLoop();
    },

    startHittaMoveLoop() {
        if (this._hittaMoveActive) return;
        this._hittaMoveActive = true;
        const loop = () => {
            if (!this.isHittaMoving || window.location.hash !== '#game-hitta') {
                this._hittaMoveActive = false;
                return;
            }
            const area = document.getElementById('hitta-area');
            if (!area) { this._hittaMoveActive = false; return; }
            const rect = area.getBoundingClientRect();
            const letters = area.querySelectorAll('span');
            letters.forEach(span => {
                let x = parseFloat(span.style.left);
                let y = parseFloat(span.style.top);
                let vx = span._vx || 0;
                let vy = span._vy || 0;
                
                x += vx;
                y += vy;

                if (x < 5 || x > 95) span._vx *= -1;
                if (y < 5 || y > 95) span._vy *= -1;

                span.style.left = x + '%';
                span.style.top = y + '%';
            });
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    toggleHittaRotation() {
        this.isHittaRotating = !this.isHittaRotating;
        const btn = document.getElementById('hitta-rotate-toggle');
        if (btn) {
            btn.style.background = this.isHittaRotating ? '#E74C3C' : '#2ECC71';
            btn.innerText = this.isHittaRotating ? 'Rotera inte ⏹️' : 'Rotera 🔄';
        }
        const letters = document.querySelectorAll('#hitta-area span');
        letters.forEach(span => {
            span.style.animationPlayState = this.isHittaRotating ? 'running' : 'paused';
        });
    },

    spawnHittaLetter(char, isTarget, container) {
        const span = document.createElement('span');
        span.innerText = char;
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6', '#E67E22', '#4A90E2'];
        const startRot = Math.random() * 360;
        span.style.cssText = `position: absolute; left: ${Math.random()*75 + 10}%; top: ${Math.random()*75 + 10}%; font-size: ${40 + Math.random()*30}px; color: ${colors[Math.floor(Math.random()*colors.length)]}; cursor: pointer; user-select: none; font-weight: bold; transition: opacity 0.3s, transform 0.3s; transform: translate(-50%, -50%) rotate(${startRot}deg); --start-rot: ${startRot}deg;`;

        span._vx = (Math.random() - 0.5) * 0.4;
        span._vy = (Math.random() - 0.5) * 0.4;

        // Always add the animation, but set it to paused if rotation is off
        span.style.animation = 'hitta-continuous-rotate 4s linear infinite';
        span.style.animationPlayState = this.isHittaRotating ? 'running' : 'paused';

        this.makeDraggable(span);

        span.onclick = () => {
            if (isTarget) {
                span.style.transform = 'scale(0) rotate(360deg)'; 
                span.style.opacity = '0'; 
                setTimeout(() => span.remove(), 300);
                this.lettersToFind--;
                const countEl = document.getElementById('hitta-count'); 
                if (countEl) countEl.innerText = this.lettersToFind;
                if (this.lettersToFind <= 0) { 
                    setTimeout(() => { 
                        this.showToast(this.cheer()); 
                        this.incrementProgress();
                        this.initHittaGame(); 
                    }, 500); 
                }
            } else { 
                // Shake if wrong letter
                span.style.transition = 'transform 0.1s';
                span.style.transform += ' translateX(5px)';
                setTimeout(() => {
                    span.style.transform = span.style.transform.replace(' translateX(5px)', '');
                }, 100);
            }
        };
        container.appendChild(span);
    },

    makeDraggable(el) {
        let isDragging = false;
        let startX, startY;
        let originalX, originalY;

        const start = (e) => {
            isDragging = false;
            startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            originalX = el.offsetLeft;
            originalY = el.offsetTop;
            el.style.zIndex = 1000;
            
            const move = (e) => {
                const curX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                const curY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
                if (Math.abs(curX - startX) > 5 || Math.abs(curY - startY) > 5) {
                    isDragging = true;
                    el.style.left = (originalX + (curX - startX)) + 'px';
                    el.style.top = (originalY + (curY - startY)) + 'px';
                }
            };
            
            const end = () => {
                el.style.zIndex = '';
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
                document.removeEventListener('touchmove', move);
                document.removeEventListener('touchend', end);
                if (isDragging) {
                    // Prevent click if we were dragging
                    el.onclick = null;
                    setTimeout(() => {
                        el.onclick = (originalOnClick);
                    }, 1);
                }
            };
            
            const originalOnClick = el.onclick;
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', end);
            document.addEventListener('touchmove', move, { passive: false });
            document.addEventListener('touchend', end);
        };

        el.addEventListener('mousedown', start);
        el.addEventListener('touchstart', start, { passive: false });
    }
});
