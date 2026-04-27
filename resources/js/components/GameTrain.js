Object.assign(App.prototype, {
    initTrainGame() {
        const div = this.screens['game-train'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="background: linear-gradient(180deg, #E1F5FE 0%, #B3E5FC 100%); min-height: 560px; text-align: center; position: relative; padding: 20px; overflow: hidden;">
                <div style="position: absolute; top: 20px; left: 20px;">
                    ${this.getBackButton('letter-menu')}
                </div>

                <div id="train-mission" style="background: white; padding: 15px 30px; border-radius: 20px; display: inline-block; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 40px; border: 4px solid #0288D1;">
                    <h2 style="color: #01579B; margin: 0;">Bokstavs-Tåget 🚂</h2>
                    <p style="margin: 5px 0; color: #546E7A;">Vilken bokstav saknas i tåget?</p>
                </div>

                <div id="train-track" style="display: flex; align-items: flex-end; justify-content: center; gap: 5px; margin: 50px 0; transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);">
                    <div id="train-wagons" style="display: flex; gap: 5px; padding-bottom: 15px;"></div>
                    <div style="font-size: 8rem; margin-left: -5px; z-index: 2; transform: scaleX(-1); margin-bottom: -10px;">🚂</div>
                </div>

                <div id="train-options" style="display: flex; gap: 20px; justify-content: center; margin-top: 50px;"></div>
            </div>
            ${this.getCheerleader()}
        `;

        this.nextTrainRound();
    },

    nextTrainRound() {
        const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
        const lower = "abcdefghijklmnopqrstuvwxyzåäö";
        const alphabet = Math.random() > 0.5 ? upper : lower;
        const letters = alphabet.split('');
        const startIndex = Math.floor(Math.random() * (letters.length - 4));
        const sequence = letters.slice(startIndex, startIndex + 4);
        const missingIndex = Math.floor(Math.random() * 4);
        this.trainTarget = sequence[missingIndex];

        const wagonsEl = document.getElementById('train-wagons');
        wagonsEl.innerHTML = sequence.map((char, i) => `
            <div style="width: 100px; height: 80px; background: #FF7043; border-radius: 10px; border: 4px solid #D84315; display: flex; justify-content: center; align-items: center; font-size: 3rem; font-weight: 900; color: white; position: relative; box-shadow: 0 5px 0 #BF360C;">
                ${i === missingIndex ? '?' : char}
                <div style="position: absolute; bottom: -15px; left: 10px; width: 25px; height: 25px; background: #263238; border-radius: 50%; border: 3px solid #CFD8DC;"></div>
                <div style="position: absolute; bottom: -15px; right: 10px; width: 25px; height: 25px; background: #263238; border-radius: 50%; border: 3px solid #CFD8DC;"></div>
            </div>
        `).join('');

        const options = [this.trainTarget];
        while (options.length < 4) {
            let r = letters[Math.floor(Math.random() * letters.length)];
            if (!options.includes(r)) options.push(r);
        }
        options.sort();

        const optionsEl = document.getElementById('train-options');
        optionsEl.innerHTML = options.map(opt => `
            <button class="menu-card" style="width: 100px; height: 100px; font-size: 3rem; color: #01579B;" onclick="window.gameApp.checkTrain('${opt}')">
                ${opt}
            </button>
        `).join('');
    },

    checkTrain(picked) {
        if (picked === this.trainTarget) {
            this.showToast('TJUT-TJUT! RÄTT! 🚂💨', 1500);
            this.addScore(10);
            this.incrementProgress();
            this.cheer('jump');
            
            const track = document.getElementById('train-track');
            track.style.transform = 'translateX(1000px)';
            
            setTimeout(() => {
                track.style.transition = 'none';
                track.style.transform = 'translateX(-1000px)';
                setTimeout(() => {
                    track.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    track.style.transform = 'translateX(0)';
                    this.nextTrainRound();
                }, 50);
            }, 1000);
        } else {
            this.showToast('Hoppsan! Det var inte rätt vagn. 😅');
        }
    }
});
