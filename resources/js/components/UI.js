Object.assign(App.prototype, {
    getHUD() {
        if (!this.state.user) return '';
        const bedtimeIcon = this.state.bedtimeMode ? '🌙' : '☀️';
        const cur = this.state.currentScreen;
        const isHome = cur === 'main-menu';
        const backMap = {
            'game-math-penguin': 'math-menu',
            'game-math-feed': 'math-menu',
            'game-math-dots': 'math-menu',
            'math-menu': 'main-menu',
            'game-pop': 'spel-menu',
            'game-catch': 'spel-menu',
            'game-race': 'spel-menu',
            'game-whack': 'spel-menu',
            'game-space': 'spel-menu',
            'game-bubble': 'spel-menu',
            'game-memory': 'letter-menu',
            'game-adventure': 'spel-menu',
            'spel-menu': 'main-menu',
            'letter-menu': 'main-menu',
            'word-menu': 'main-menu',
            'game-stava': 'word-menu',
            'game-ljuda': 'word-menu',
            'game-hitta': 'letter-menu',
            'game-rabbla': 'letter-menu',
            'stories': 'main-menu',
            'admin-menu': 'main-menu',
            'avatar-select': 'main-menu',
            'difficulty-select': 'main-menu',
            'shop': 'main-menu'
        };
        const backTarget = backMap[cur];

        return `
            <div class="hud-bar">
                <div class="hud-left" style="display: flex; gap: 20px; align-items: center;">
                    ${!isHome ? `<div class="hud-icon" style="font-size: 2.25rem; cursor:pointer;" onclick="window.gameApp.showScreen('main-menu')" title="Hem">🏠</div>` : ''}
                    ${backTarget ? `<div class="hud-icon" style="font-size: 2rem; cursor:pointer;" onclick="window.gameApp.showScreen('${backTarget}')" title="Tillbaka">⬅️</div>` : ''}
                </div>
                <div class="hud-center" style="display: flex; gap: 15px; align-items: center;">
                    <div style="font-size: 3rem; filter: drop-shadow(0 0 10px rgba(74, 144, 226, 0.3)); cursor: pointer;" onclick="window.gameApp.showScreen('avatar-select')" title="Ändra avatar">${this.state.avatar?.icon || ''}</div>
                    <div class="hud-text" style="text-align: left;">
                        <div class="hud-name" style="cursor: pointer;" onclick="window.gameApp.showScreen('user-select')" title="Byt person">${this.state.user?.name || ''}</div>
                        <div style="cursor: pointer; display: flex; align-items: center; gap: 5px; margin-top: 2px;" onclick="window.gameApp.showScreen('difficulty-select')" title="Ändra svårighet">
                            <span style="font-size: 0.9rem;">${CONFIG.difficulties.find(d => d.id === this.state.difficulty)?.icon || '⭐'}</span>
                            <span style="color: ${CONFIG.difficulties.find(d => d.id === this.state.difficulty)?.color || '#95A5A6'}; font-weight: bold; font-size: 0.85rem;">
                                ${CONFIG.difficulties.find(d => d.id === this.state.difficulty)?.name || 'Lagom'}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="hud-right" style="display: flex; align-items: center; gap: 20px;">
                    <div class="hud-stats" style="cursor: pointer; transition: transform 0.2s;" onclick="window.gameApp.showScreen('shop')" title="Gå till butiken">
                        <span style="font-size: 1.2rem;">⭐</span>
                        <span style="font-weight: bold; color: #F1C40F;">${this.state.score}</span>
                    </div>
                    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                        <div style="color: #2ECC71; font-weight: bold; font-size: 0.8rem; text-transform: uppercase;">Nivå ${this.state.level || 1}</div>
                        <div class="hud-progress" style="margin-top: 0; background: rgba(46, 204, 113, 0.2); padding: 2px 8px; border-radius: 10px; font-size: 0.75rem;">${this.progressCount} / ${this.config.targetProgress || 20}</div>
                    </div>
                    <div onclick="window.gameApp.toggleBedtimeMode()" style="cursor: pointer; font-size: 1.8rem; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" title="Sovläge">${bedtimeIcon}</div>
                </div>
            </div>
        `;
    },

    updateUserSelectScreen() {
        const div = this.screens['user-select'];
        div.innerHTML = `
            ${this.getHUD()}
            <h1>Vem ska spela?</h1>
            <div class="menu-grid">
                <div class="menu-card user-card" style="border-color: var(--color-william)" onclick="window.gameApp.selectUser('William', 8, 'var(--color-william)')">
                    <div class="menu-card-icon">👦</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: var(--color-william)">William</div>
                        <div class="menu-card-subtitle">8 år</div>
                    </div>
                </div>
                <div class="menu-card user-card" style="border-color: var(--color-liam)" onclick="window.gameApp.selectUser('Liam', 7, 'var(--color-liam)')">
                    <div class="menu-card-icon">👦</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: var(--color-liam)">Liam</div>
                        <div class="menu-card-subtitle">7 år</div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 50px;">
                <button class="menu-card" style="width: auto; padding: 15px 40px; background: #2D3748; border: none; color: white;" onclick="window.gameApp.showScreen('admin-menu')">⚙️ Admin</button>
            </div>
        `;
    },

    selectUser(name, age, color) {
        this.state.user = { name, age, color };
        this.saveState();
        this.updateAvatarSelectScreen();
        this.showScreen('avatar-select');
    },

    updateAvatarSelectScreen() {
        const div = this.screens['avatar-select'];
        div.innerHTML = `
            ${this.getHUD()}
            <h1 style="font-style: italic;">Välj din figur, ${this.state.user?.name}!</h1>
            <div class="avatar-selection-grid">
                ${CONFIG.avatars.filter(a => a.price === 0 || this.state.purchasedItems.includes(a.id)).map(a => `
                    <div class="avatar-option" onclick="window.gameApp.selectAvatar('${a.id}')">
                        <div style="font-size: 3rem;">${a.icon}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    selectAvatar(id) {
        this.state.avatar = CONFIG.avatars.find(a => a.id === id);
        this.saveState();
        this.updateDifficultySelectScreen();
        this.showScreen('difficulty-select');
    },

    updateDifficultySelectScreen() {
        const div = this.screens['difficulty-select'];
        div.innerHTML = `
            ${this.getHUD()}
            <h1>Hur svårt ska det vara?</h1>
            <div style="display: flex; flex-direction: column; gap: 15px; max-width: 600px; margin: 0 auto; padding: 0 20px;">
                ${CONFIG.difficulties.map((d, index) => `
                    <div class="menu-card" style="border-color: ${d.color}; display: flex; align-items: center; justify-content: flex-start; padding: 15px 30px; width: 100%;" onclick="window.gameApp.selectDifficulty(${d.id})">
                        <div style="font-size: 2.5rem; margin-right: 20px; font-weight: bold; color: ${d.color}; min-width: 40px; text-align: center;">${index + 1}.</div>
                        <div class="menu-card-icon" style="margin-bottom: 0; margin-right: 20px; font-size: 2.5rem;">${d.icon}</div>
                        <div class="menu-card-text" style="text-align: left; flex-grow: 1;">
                            <div class="menu-card-title" style="color: ${d.color}; font-size: 2rem; margin: 0;">${d.name}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    selectDifficulty(id) {
        this.state.difficulty = id;
        this.saveState();
        this.updateMainMenuScreen();
        this.showScreen('main-menu');
    },

    selectDifficultyQuick(id) {
        this.state.difficulty = id;
        this.saveState();
        // Refresh current menu to show active state
        const refreshMap = {
            'spel-menu': 'updateSpelMenuScreen',
            'letter-menu': 'updateLetterMenuScreen',
            'word-menu': 'updateWordMenuScreen',
            'math-menu': 'updateMathMenuScreen',
            'penguin-menu': 'updatePenguinMenuScreen',
            'feed-menu': 'updateFeedMenuScreen',
            'dots-menu': 'updateDotsMenuScreen'
        };
        const method = refreshMap[this.state.currentScreen];
        if (method && this[method]) this[method]();
        
        // Update HUD
        const hudName = document.querySelector('.hud-name');
        if (hudName) {
            const hud = this.getHUD();
            const temp = document.createElement('div');
            temp.innerHTML = hud;
            const newHud = temp.querySelector('.hud-bar');
            if (newHud) document.querySelector('.hud-bar').replaceWith(newHud);
        }
        
        this.showToast(`Svårighet: ${CONFIG.difficulties.find(d => d.id === id).name} ${CONFIG.difficulties.find(d => d.id === id).icon}`, 1000);
    },

    updateMainMenuScreen() {
        const div = this.screens['main-menu'];
        const quests = this.state.dailyQuests || [];
        
        div.innerHTML = `
            ${this.getHUD()}
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
                <h1 style="margin: 0;">Hej ${this.state.user ? this.state.user.name : 'där'}! 👋</h1>
                <div id="daily-quests-box" style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 20px; width: 300px; text-align: left; border: 2px solid rgba(255,255,255,0.1);">
                    <div style="font-size: 0.8rem; color: #A0AEC0; margin-bottom: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Dagens Uppdrag 🎯</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${quests.map(q => `
                            <div style="display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: ${q.done ? '#2ECC71' : 'white'}; opacity: ${q.done ? 0.6 : 1};">
                                <span>${q.done ? '✅' : '⭕'}</span>
                                <span style="${q.done ? 'text-decoration: line-through' : ''}">${q.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="menu-grid">
                <div class="menu-card active-orange" onclick="window.gameApp.showScreen('spel-menu')">
                    <div class="menu-card-icon">🎮</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title">Roliga Spel</div>
                        <div class="menu-card-subtitle">Hoppa & Poppa!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: var(--color-liam)" onclick="window.gameApp.showScreen('letter-menu')">
                    <div class="menu-card-icon">🔤</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: var(--color-liam)">Bokstäver</div>
                        <div class="menu-card-subtitle">Hitta & Memory!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: var(--color-william)" onclick="window.gameApp.showScreen('word-menu')">
                    <div class="menu-card-icon">✏️</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: var(--color-william)">Ord & Meningar</div>
                        <div class="menu-card-subtitle">Lär dig stava!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #F1C40F" onclick="window.gameApp.showScreen('math-menu')">
                    <div class="menu-card-icon">🔢</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #F1C40F">Matte-Äventyr</div>
                        <div class="menu-card-subtitle">Räkna med djuren!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: var(--color-story)" onclick="window.gameApp.showScreen('stories')">
                    <div class="menu-card-icon">📖</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: var(--color-story)">Sagor</div>
                        <div class="menu-card-subtitle">Läs om dig själv!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #2ECC71" onclick="window.gameApp.showScreen('shop')">
                    <div class="menu-card-icon">🛒</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #2ECC71">Butik</div>
                        <div class="menu-card-subtitle">Köp nya figurer!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #F1C40F" onclick="window.gameApp.showScreen('wheel-screen')">
                    <div class="menu-card-icon">🎡</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #F1C40F">Lyckohjulet</div>
                        <div class="menu-card-subtitle">Vinn stjärnor!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #3498DB" onclick="window.gameApp.showScreen('profile-screen')">
                    <div class="menu-card-icon">📸</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #3498DB">Min Profil</div>
                        <div class="menu-card-subtitle">Se dina märken!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #FF6B6B" onclick="window.gameApp.showScreen('creator-screen')">
                    <div class="menu-card-icon">🎨</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #FF6B6B">Skaparlådan</div>
                        <div class="menu-card-subtitle">Rita & klistra!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #718096" onclick="window.gameApp.showScreen('admin-menu')">
                    <div class="menu-card-icon">⚙️</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #718096">Inställningar</div>
                    </div>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
    },

    getCheerleader() {
        if (!this.state.avatar || !['game-pop', 'game-catch', 'game-race', 'game-whack', 'game-space', 'game-bubble', 'game-adventure', 'main-menu'].includes(this.state.currentScreen)) return '';
        return `
            <div id="cheerleader" class="cheerleader-container" style="position: fixed; bottom: 30px; left: 30px; z-index: 1000; pointer-events: none; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                <div class="cheerleader-bubble hidden" id="cheer-bubble" style="position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%); background: white; padding: 10px 15px; border-radius: 20px; border: 3px solid var(--color-william); min-width: 120px; text-align: center; font-weight: bold; color: #2D3748; box-shadow: 0 5px 15px rgba(0,0,0,0.2); font-size: 0.9rem;">
                    Heja dig! 🌟
                </div>
                <div class="cheerleader-avatar" style="font-size: 5rem; filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));">
                    ${this.state.avatar.icon}
                </div>
            </div>
        `;
    },

    updateMathMenuScreen() {
        const div = this.screens['math-menu'];
        div.innerHTML = `
            ${this.getHUD()}
            <h1>Matte-Äventyret</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Välj ett mattespel!</p>
            <div class="menu-grid">
                <div class="menu-card" style="border-color: #F1C40F" onclick="window.gameApp.showScreen('penguin-menu')">
                    <div class="menu-card-icon">🐧</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #F1C40F">Pingvinhopp</div>
                        <div class="menu-card-subtitle">Hoppa på isberg!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #E67E22" onclick="window.gameApp.showScreen('feed-menu')">
                    <div class="menu-card-icon">🐒</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #E67E22">Mata Djuren</div>
                        <div class="menu-card-subtitle">Mata med rätt antal!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #3498DB" onclick="window.gameApp.showScreen('dots-menu')">
                    <div class="menu-card-icon">✏️</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #3498DB">Prick till Prick</div>
                        <div class="menu-card-subtitle">Rita fina figurer!</div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Start</button></div>
        `;
    },

    updatePenguinMenuScreen() {
        const div = this.screens['penguin-menu'];
        const enabled = this.config.math.penguinModes || ['count', 'add', 'sub', 'mult'];
        const allModes = [
            { id: 'count', label: 'Räkna (1, 2, 3...)', icon: '🔢', color: '#F1C40F' },
            { id: 'add', label: 'Plus (+)', icon: '➕', color: '#2ECC71' },
            { id: 'sub', label: 'Minus (-)', icon: '➖', color: '#E74C3C' },
            { id: 'mult', label: 'Gånger (×)', icon: '✖️', color: '#9B59B6' }
        ];
        
        div.innerHTML = `
            ${this.getHUD()}
            <h1>Pingvinhopp</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Välj hur du vill räkna!</p>
            <div class="menu-grid">
                ${allModes.filter(m => enabled.includes(m.id)).map(m => `
                    <div class="menu-card" style="border-color: ${m.color}" onclick="window.gameApp.initMathGame('${m.id}')">
                        <div class="menu-card-icon">${m.icon}</div>
                        <div class="menu-card-text"><div class="menu-card-title" style="color: ${m.color}">${m.label}</div></div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('math-menu')">Tillbaka</button></div>
        `;
    },

    updateFeedMenuScreen() {
        const div = this.screens['feed-menu'];
        const enabled = this.config.math.feedModes || ['count', 'add', 'sub', 'mult'];
        const allModes = [
            { id: 'count', label: 'Räkna (1, 2, 3...)', icon: '🔢', color: '#F1C40F' },
            { id: 'add', label: 'Plus (+)', icon: '➕', color: '#2ECC71' },
            { id: 'sub', label: 'Minus (-)', icon: '➖', color: '#E74C3C' },
            { id: 'mult', label: 'Gånger (×)', icon: '✖️', color: '#9B59B6' }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <h1>Mata Djuren</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Välj hur du vill räkna!</p>
            <div class="menu-grid">
                ${allModes.filter(m => enabled.includes(m.id)).map(m => `
                    <div class="menu-card" style="border-color: ${m.color}" onclick="window.gameApp.initMathFeedGame('${m.id}')">
                        <div class="menu-card-icon">${m.icon}</div>
                        <div class="menu-card-text"><div class="menu-card-title" style="color: ${m.color}">${m.label}</div></div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('math-menu')">Tillbaka</button></div>
        `;
    },

    updateDotsMenuScreen() {
        const div = this.screens['dots-menu'];
        const enabled = this.config.math.dotsModes || ['count', 'add', 'sub', 'mult'];
        const allModes = [
            { id: 'count', label: 'Räkna (1, 2, 3...)', icon: '🔢', color: '#F1C40F' },
            { id: 'add', label: 'Plus (+)', icon: '➕', color: '#2ECC71' },
            { id: 'sub', label: 'Minus (-)', icon: '➖', color: '#E74C3C' },
            { id: 'mult', label: 'Gånger (×)', icon: '✖️', color: '#9B59B6' }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <h1>Prick till Prick</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Välj hur du vill räkna!</p>
            <div class="menu-grid">
                ${allModes.filter(m => enabled.includes(m.id)).map(m => `
                    <div class="menu-card" style="border-color: ${m.color}" onclick="window.gameApp.initMathDotsGame('${m.id}')">
                        <div class="menu-card-icon">${m.icon}</div>
                        <div class="menu-card-text"><div class="menu-card-title" style="color: ${m.color}">${m.label}</div></div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('math-menu')">Tillbaka</button></div>
        `;
    },

    updateSpelMenuScreen() {
        const div = this.screens['spel-menu'];
        const games = [
            { id: 'game-pop', icon: '🎈', title: 'Ballongjakten', subtitle: 'Smäll alla ballonger!', color: '#FF6B6B', price: 0 },
            { id: 'game-adventure', icon: '⚡', title: 'Hjälte-Hoppet', subtitle: 'Hoppa & Skjut!', color: '#E67E22', price: 50 },
            { id: 'game-catch', icon: '🍎', title: 'Frukt-Frossa', subtitle: 'Fånga all frukt!', color: '#2ECC71', price: 100 },
            { id: 'game-race', icon: '🏎️', title: 'Racer-Robban', subtitle: 'Kör så det ryker!', color: '#3498DB', price: 150 },
            { id: 'game-whack', icon: '🔨', title: 'Hammar-Hjälten', subtitle: 'Poffa alla monster!', color: '#9B59B6', price: 200 },
            { id: 'game-space', icon: '🚀', title: 'Rymd-Räddaren', subtitle: 'Skydda jorden!', color: '#F1C40F', price: 250 },
            { id: 'game-bubble', icon: '🔵', title: 'Bubbel-Bus', subtitle: 'Skjut och matcha!', color: '#3498DB', price: 300 }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <h1>Roliga Spel 🎮</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Lås upp fler spel med dina stjärnor!</p>
            <div class="menu-grid">
                ${games.map(g => {
                    const isUnlocked = g.price === 0 || this.state.purchasedItems.includes(g.id);
                    if (isUnlocked) {
                        return `
                            <div class="menu-card" style="border-color: ${g.color}; flex-direction: column; align-items: stretch; padding: 15px;">
                                <div onclick="window.gameApp.showScreen('${g.id}')" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; cursor: pointer;">
                                    <div class="menu-card-icon" style="margin: 0; font-size: 2.5rem;">${g.icon}</div>
                                    <div class="menu-card-text" style="text-align: left;">
                                        <div class="menu-card-title" style="color: ${g.color}; margin: 0;">${g.title}</div>
                                        <div class="menu-card-subtitle" style="margin: 0;">${g.subtitle}</div>
                                    </div>
                                </div>
                                
                                <div style="display: flex; gap: 5px; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 12px; margin-top: auto;">
                                    ${CONFIG.difficulties.map(d => `
                                        <button onclick="event.stopPropagation(); window.gameApp.selectDifficultyQuick(${d.id})" 
                                                style="flex: 1; border: none; padding: 6px 2px; border-radius: 8px; font-size: 0.75rem; font-weight: bold; cursor: pointer; transition: all 0.2s;
                                                       background: ${this.state.difficulty === d.id ? d.color : 'transparent'};
                                                       color: ${this.state.difficulty === d.id ? 'black' : '#A0AEC0'};
                                                       border: 1px solid ${this.state.difficulty === d.id ? d.color : 'rgba(255,255,255,0.1)'};">
                                            ${d.icon} ${d.name}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="menu-card" style="border-color: #718096; position: relative;" onclick="window.gameApp.buyGame('${g.id}', '${g.title}', ${g.price})">
                                <div class="menu-card-icon" style="filter: grayscale(100%) opacity(50%);">${g.icon}</div>
                                <div class="menu-card-text" style="filter: opacity(50%);">
                                    <div class="menu-card-title" style="color: white">${g.title}</div>
                                    <div class="menu-card-subtitle">Låst 🔒</div>
                                </div>
                                <div style="position: absolute; top: -10px; right: -10px; background: #F1C40F; color: black; padding: 5px 10px; border-radius: 15px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                                    ${g.price} ⭐
                                </div>
                            </div>
                        `;
                    }
                }).join('')}
            </div>
        `;
    },

    updateLetterMenuScreen() {
        const div = this.screens['letter-menu'];
        const games = [
            { id: 'game-hitta', icon: '🔍', title: 'Hitta Bokstaven', subtitle: 'Leta rätt på bokstaven!', color: 'var(--color-william)' },
            { id: 'game-memory', icon: '🧠', title: 'Bokstavs-Memory', subtitle: 'Hitta par!', color: '#9B59B6' },
            { id: 'game-tracing', icon: '✍️', title: 'Bokstavs-Spåraren', subtitle: 'Lär dig skriva!', color: '#AB47BC' },
            { id: 'game-maze', icon: '🌀', title: 'Bokstavs-Labyrinten', subtitle: 'Hitta utgången!', color: '#F1C40F' },
            { id: 'game-train', icon: '🚂', title: 'Bokstavs-Tåget', subtitle: 'Vilken saknas?', color: '#0288D1' },
            { id: 'game-fishing', icon: '🎣', title: 'Bokstavs-Fisket', subtitle: 'Fånga rätt fisk!', color: '#2ECC71' },
            { id: 'game-rabbla', icon: '🗣️', title: 'Bokstav-Rabbla', subtitle: 'Säg bokstaven!', color: '#E67E22' }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <h1>Bokstäver 🔤</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Lär känna alla bokstäver!</p>
            <div class="menu-grid">
                ${games.map(g => this.getQuickMenuCard(g)).join('')}
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Start</button></div>
        `;
    },

    getQuickMenuCard(g) {
        return `
            <div class="menu-card" style="border-color: ${g.color}; flex-direction: column; align-items: stretch; padding: 15px;">
                <div onclick="window.gameApp.showScreen('${g.id}')" style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; cursor: pointer;">
                    <div class="menu-card-icon" style="margin: 0; font-size: 2.5rem;">${g.icon}</div>
                    <div class="menu-card-text" style="text-align: left;">
                        <div class="menu-card-title" style="color: ${g.color}; margin: 0;">${g.title}</div>
                        <div class="menu-card-subtitle" style="margin: 0;">${g.subtitle}</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 5px; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 12px; margin-top: auto;">
                    ${CONFIG.difficulties.map(d => `
                        <button onclick="event.stopPropagation(); window.gameApp.selectDifficultyQuick(${d.id})" 
                                style="flex: 1; border: none; padding: 6px 2px; border-radius: 8px; font-size: 0.75rem; font-weight: bold; cursor: pointer; transition: all 0.2s;
                                       background: ${this.state.difficulty === d.id ? d.color : 'transparent'};
                                       color: ${this.state.difficulty === d.id ? 'black' : '#A0AEC0'};
                                       border: 1px solid ${this.state.difficulty === d.id ? d.color : 'rgba(255,255,255,0.1)'};">
                            ${d.icon} ${d.name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    updateWordMenuScreen() {
        const div = this.screens['word-menu'];
        const games = [
            { id: 'game-stava', icon: '✏️', title: 'Stava Ordet', subtitle: 'Bygg ord!', color: 'var(--color-liam)' },
            { id: 'game-rim', icon: '🏠', title: 'Rim-Stugan', subtitle: 'Hitta ord som rimmar!', color: '#FF6B6B' },
            { id: 'game-ljuda', icon: '🗣️', title: 'Ljuda ord', subtitle: 'Läs högt!', color: '#3498DB' },
            { id: 'game-mening', icon: '🏗️', title: 'Mening-Byggaren', subtitle: 'Bygg meningar!', color: '#2ECC71' },
            { id: 'game-gomma', icon: '🕵️', title: 'Ord-Gömman', subtitle: 'Hitta gömda ord!', color: '#9B59B6' }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <h1>Ord & Meningar ✏️</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Lär dig bygga ord och meningar!</p>
            <div class="menu-grid">
                ${games.map(g => this.getQuickMenuCard(g)).join('')}
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Start</button></div>
        `;
    },

    updateMathMenuScreen() {
        const div = this.screens['math-menu'];
        const games = [
            { id: 'penguin-menu', icon: '🐧', title: 'Pingvinhopp', subtitle: 'Hoppa på isberg!', color: '#F1C40F' },
            { id: 'feed-menu', icon: '🐒', title: 'Mata Djuren', subtitle: 'Räkna rätt mat!', color: '#E67E22' },
            { id: 'game-vag', icon: '⚖️', title: 'Våg-Spelet', subtitle: 'Hitta jämvikt!', color: '#2ECC71' },
            { id: 'game-monster', icon: '🌈', title: 'Mönster-Magikern', subtitle: 'Vad kommer näst?', color: '#9B59B6' },
            { id: 'game-klocka', icon: '⏰', title: 'Klock-Kul', subtitle: 'Lär dig klockan!', color: '#FF6B6B' },
            { id: 'dots-menu', icon: '✏️', title: 'Prick till Prick', subtitle: 'Rita figurer!', color: '#3498DB' }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <h1>Matte-Äventyr 🔢</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Välj ett mattespel!</p>
            <div class="menu-grid">
                ${games.map(g => this.getQuickMenuCard(g)).join('')}
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Start</button></div>
        `;
    },
    getBackButton(target = 'main-menu') {
        return `
            <button onclick="window.gameApp.showScreen('${target}')" 
                    style="position: absolute; top: 20px; left: 20px; z-index: 1000; background: rgba(45, 55, 72, 0.9); color: white; padding: 10px 20px; border-radius: 15px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: all 0.2s; border: 2px solid rgba(255,255,255,0.2); font-family: inherit;">
                <span style="font-size: 1.2rem;">⬅️</span> Tillbaka
            </button>
        `;
    }
});
