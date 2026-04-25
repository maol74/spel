Object.assign(App.prototype, {
    getHUD() {
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
                        <div class="hud-level" style="cursor: pointer; color: #95A5A6; font-size: 0.9rem;" onclick="window.gameApp.showScreen('difficulty-select')" title="Ändra svårighet">
                            Svårighet: ${CONFIG.difficulties.find(d => d.id === this.state.difficulty)?.name || this.state.difficulty}
                        </div>
                    </div>
                </div>
                <div class="hud-right" style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                    <div class="hud-stats" style="cursor: pointer; transition: transform 0.2s;" onclick="window.gameApp.showScreen('shop')" title="Gå till butiken" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                        <span style="font-size: 1.2rem;">⭐</span>
                        <span style="font-weight: bold; color: #F1C40F;">${this.state.score}</span>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <div style="color: #2ECC71; font-weight: bold; font-size: 1rem;">NIVÅ ${this.state.level || 1}</div>
                        <div class="hud-progress" style="margin-top: 0;">${this.progressCount} / ${this.config.targetProgress || 20}</div>
                    </div>
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
            <div class="menu-grid">
                ${CONFIG.difficulties.map(d => `
                    <div class="menu-card" style="border-color: ${d.color}" onclick="window.gameApp.selectDifficulty(${d.id})">
                        <div class="menu-card-icon">${d.icon}</div>
                        <div class="menu-card-text">
                            <div class="menu-card-title" style="color: ${d.color}">${d.name}</div>
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

    updateMainMenuScreen() {
        const div = this.screens['main-menu'];
        div.innerHTML = `
            ${this.getHUD()}
            <h1>Hej ${this.state.user ? this.state.user.name : 'där'}!</h1>
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
                        <div class="menu-card-title" style="color: #F1C40F">Matte-Äventyret</div>
                        <div class="menu-card-subtitle">Pingvin, Mata & Mer!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: var(--color-story)" onclick="window.gameApp.showScreen('stories')">
                    <div class="menu-card-icon">📖</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: var(--color-story)">Sagor</div>
                        <div class="menu-card-subtitle">Läs spännande berättelser!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #2ECC71" onclick="window.gameApp.showScreen('shop')">
                    <div class="menu-card-icon">🛒</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #2ECC71">Butik</div>
                        <div class="menu-card-subtitle">Köp nya figurer!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #718096" onclick="window.gameApp.showScreen('admin-menu')">
                    <div class="menu-card-icon">⚙️</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #718096">Admin</div>
                    </div>
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
                            <div class="menu-card" style="border-color: ${g.color}" onclick="window.gameApp.showScreen('${g.id}')">
                                <div class="menu-card-icon">${g.icon}</div>
                                <div class="menu-card-text">
                                    <div class="menu-card-title" style="color: ${g.color}">${g.title}</div>
                                    <div class="menu-card-subtitle">${g.subtitle}</div>
                                </div>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="menu-card" style="border-color: #718096; position: relative;" onclick="window.gameApp.buyGame('${g.id}', '${g.title}', ${g.price})">
                                <div class="menu-card-icon" style="filter: grayscale(100%) opacity(50%);">${g.icon}</div>
                                <div class="menu-card-text" style="opacity: 0.6;">
                                    <div class="menu-card-title" style="color: white">${g.title}</div>
                                    <div class="menu-card-subtitle">Låst 🔒</div>
                                </div>
                                <div style="position: absolute; top: -10px; right: -10px; background: #F1C40F; color: black; padding: 5px 10px; border-radius: 15px; font-weight: bold; border: 2px solid white;">
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
        div.innerHTML = `
            ${this.getHUD()}
            <h1>Bokstäver 🔤</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Lär känna alla bokstäver!</p>
            <div class="menu-grid">
                <div class="menu-card" style="border-color: var(--color-william)" onclick="window.gameApp.showScreen('game-hitta')">
                    <div class="menu-card-icon">🔍</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: var(--color-william)">Hitta Bokstaven</div>
                        <div class="menu-card-subtitle">Leta rätt på bokstaven!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #9B59B6" onclick="window.gameApp.showScreen('game-memory')">
                    <div class="menu-card-icon">🧠</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #9B59B6">Bokstavs-Memory</div>
                        <div class="menu-card-subtitle">Hitta par med bokstäver!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #2ECC71" onclick="window.gameApp.showScreen('game-rabbla')">
                    <div class="menu-card-icon">🗣️</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #2ECC71">Bokstav-Rabbla</div>
                        <div class="menu-card-subtitle">Säg bokstaven högt!</div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Start</button></div>
        `;
    },

    updateWordMenuScreen() {
        const div = this.screens['word-menu'];
        div.innerHTML = `
            ${this.getHUD()}
            <h1>Ord & Meningar ✏️</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Lär dig bygga ord och meningar!</p>
            <div class="menu-grid">
                <div class="menu-card" style="border-color: var(--color-liam)" onclick="window.gameApp.showScreen('game-stava')">
                    <div class="menu-card-icon">✏️</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: var(--color-liam)">Stava Ordet</div>
                        <div class="menu-card-subtitle">Bygg ord av bokstäver!</div>
                    </div>
                </div>
                <div class="menu-card" style="border-color: #3498DB" onclick="window.gameApp.showScreen('game-ljuda')">
                    <div class="menu-card-icon">🗣️</div>
                    <div class="menu-card-text">
                        <div class="menu-card-title" style="color: #3498DB">Ljuda ord</div>
                        <div class="menu-card-subtitle">Läs och säg ordet högt!</div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Start</button></div>
        `;
    }
});
