Object.assign(App.prototype, {
    initTracingGame() {
        const div = this.screens['game-tracing'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="background: white; min-height: 600px; text-align: center; position: relative; padding: 20px;">
                <div style="position: absolute; top: 20px; left: 20px;">
                    ${this.getBackButton('letter-menu')}
                </div>

                <div id="tracing-mission" style="background: #F3E5F5; padding: 15px 30px; border-radius: 20px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 20px; border: 4px solid #AB47BC;">
                    <h2 style="color: #7B1FA2; margin: 0;">Bokstavs-Spåraren ✍️</h2>
                    <p style="margin: 5px 0; color: #4A148C;">Följ siffrorna för att skriva bokstaven!</p>
                </div>

                <div id="tracing-area" style="position: relative; width: 400px; height: 500px; margin: 0 auto; background: #FAFAFA; border-radius: 30px; border: 5px dashed #E1BEE7; overflow: hidden;">
                    <div id="tracing-letter-bg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 25rem; font-weight: 900; color: #F3E5F5; user-select: none; font-family: 'Outfit', sans-serif;">A</div>
                    <svg id="tracing-svg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></svg>
                    <div id="tracing-dots" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
                </div>
            </div>
            ${this.getCheerleader()}
        `;

        this.nextTracingRound();
    },

    nextTracingRound() {
        const letters = {
            'A': [[[100, 420], [200, 100], [300, 420]], [[150, 300], [250, 300]]],
            'B': [[[120, 415], [120, 80], [280, 150], [120, 250], [300, 340], [120, 425]]],
            'C': [[[300, 120], [150, 120], [100, 250], [150, 380], [300, 380]]],
            'D': [[[120, 415], [120, 80], [320, 250], [120, 425]]],
            'E': [[[300, 80], [120, 80], [120, 420], [300, 420]], [[122, 250], [250, 250]]],
            'F': [[[120, 420], [120, 80], [300, 80]], [[120, 250], [250, 250]]],
            'H': [[[120, 80], [120, 420]], [[280, 80], [280, 420]], [[120, 250], [280, 250]]],
            'I': [[[150, 80], [250, 80]], [[200, 80], [200, 420]], [[150, 420], [250, 420]]],
            'L': [[[120, 80], [120, 420], [300, 420]]],
            'M': [[[100, 420], [100, 80], [200, 250], [300, 80], [300, 420]]],
            'O': [[[200, 81], [320, 250], [200, 420], [80, 250], [200, 79]]],
            'P': [[[120, 420], [120, 80], [300, 160], [120, 240]]],
            'S': [[[300, 100], [120, 140], [300, 340], [120, 380]]],
            'T': [[[100, 80], [300, 80]], [[200, 80], [200, 420]]],
            'V': [[[100, 80], [200, 420], [300, 80]]]
        };
        
        const available = Object.keys(letters);
        this.tracingTarget = available[Math.floor(Math.random() * available.length)];
        this.tracingStrokes = letters[this.tracingTarget];
        
        // Flatten points for the dot indicators but keep track of stroke boundaries
        this.tracingAllPoints = [];
        this.tracingStrokes.forEach((stroke, sIdx) => {
            stroke.forEach((p, pIdx) => {
                this.tracingAllPoints.push({ x: p[0], y: p[1], sIdx, pIdx });
            });
        });
        
        this.tracingIndex = 0;

        document.getElementById('tracing-letter-bg').innerText = this.tracingTarget;
        const svg = document.getElementById('tracing-svg');
        svg.innerHTML = '';
        const dotsEl = document.getElementById('tracing-dots');
        dotsEl.innerHTML = '';

        this.tracingAllPoints.forEach((p, i) => {
            const dot = document.createElement('div');
            dot.className = 'tracing-dot';
            dot.id = `tracing-dot-${i}`;
            dot.style.cssText = `
                position: absolute; left: ${p.x}px; top: ${p.y}px; transform: translate(-50%, -50%);
                width: 36px; height: 36px; background: white; border: 3px solid #AB47BC; border-radius: 50%;
                display: flex; justify-content: center; align-items: center; font-weight: bold; color: #AB47BC;
                cursor: pointer; z-index: ${100 - i}; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                transition: all 0.3s;
            `;
            dot.innerText = i + 1;
            dot.onclick = () => this.handleTracingClick(i);
            dotsEl.appendChild(dot);
        });
    },

    handleTracingClick(index) {
        if (index === this.tracingIndex) {
            const currentPoint = this.tracingAllPoints[index];
            const dot = document.getElementById(`tracing-dot-${index}`);
            dot.style.background = '#AB47BC';
            dot.style.color = 'white';
            dot.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            // If not the start of a stroke, draw line from previous point
            if (currentPoint.pIdx > 0) {
                const prevPoint = this.tracingAllPoints[index - 1];
                const svg = document.getElementById('tracing-svg');
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', prevPoint.x); line.setAttribute('y1', prevPoint.y);
                line.setAttribute('x2', currentPoint.x); line.setAttribute('y2', currentPoint.y);
                line.setAttribute('stroke', '#AB47BC'); line.setAttribute('stroke-width', '12');
                line.setAttribute('stroke-linecap', 'round');
                line.style.opacity = '0';
                svg.appendChild(line);
                setTimeout(() => line.style.opacity = '1', 50);
            }
            
            this.tracingIndex++;
            this.addScore(5);

            if (this.tracingIndex === this.tracingAllPoints.length) {
                this.showToast('HELT PERFEKT RITAT! ✍️🌟', 1500);
                this.addScore(15);
                this.incrementProgress();
                this.cheer('jump');
                setTimeout(() => this.nextTracingRound(), 2500);
            }
        } else if (index > this.tracingIndex) {
            this.showToast('Hitta siffra ' + (this.tracingIndex + 1) + '! 🔍', 500);
        }
    }
});
