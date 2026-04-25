Object.assign(App.prototype, {
    renderStoriesList() {
        const div = this.screens['stories'];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card">
                <h1 style="color: var(--color-story); font-style: italic;">Läs äventyr om dig, ${this.state.user?.name}!</h1>
                ${CONFIG.stories.map((s, i) => `
                    <div class="menu-card" style="border-color: #2D3748" onclick="window.gameApp.readStory(${i})">
                        <div class="menu-card-icon">${s.icon}</div>
                        <div class="menu-card-title" style="color: var(--color-story); font-size: 1.4rem;">${this.state.user?.name} ${s.title}</div>
                    </div>
                `).join('')}
                <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Start</button></div>
            </div>
        `;
    },

    readStory(index) {
        const div = this.screens['stories'];
        const s = CONFIG.stories[index];
        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 1000px; width: 98%; padding: 2rem;">
                <div class="story-header" style="width:100%; margin-bottom: 5px;">
                    <div class="back-link" onclick="window.gameApp.renderStoriesList()">
                        <span style="font-size: 1.5rem;">⬅</span> Tillbaka
                    </div>
                </div>
                <h2 style="color: var(--color-story); margin-bottom: 15px; font-size: 1.8rem;">${this.state.user?.name} ${s.title}</h2>
                
                <div class="story-content-text" style="max-height: none; overflow: visible; font-size: 1.1rem; text-align: left;">
                    <img src="${s.img}" style="width: 320px; float: left; margin: 0 25px 15px 0; border-radius: 20px; border: 3px solid var(--color-story); box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <p style="margin: 0; line-height: 1.6;">${this.state.user?.name} ${s.text}</p>
                    <div style="font-size: 3rem; margin-top: 15px; clear: both; text-align: center;">${s.icon}</div>
                </div>
            </div>
        `;
    }
});
