class App {
    constructor() {
        this.state = {
            user: null,
            avatar: null,
            difficulty: 1,
            soundEnabled: false,
            currentScreen: 'loading-screen',
            score: 100,
            level: 1,
            progress: '1 / 20',
            purchasedItems: [],
            lastSpinDate: null,
            badges: [],
            dailyQuests: [],
            lastQuestDate: null,
            unlockedPowers: [],
            bedtimeMode: false
        };
        this.screens = {};
        this.guessedLetters = [];
        this.currentWord = null;
        this.config = {
            toastDuration: 3000,
            adventure: { targetScore: 150, baseSpeed: 5, spawnRate: 0.02, gravity: 0.6 },
            stava: { toastDelay: 1500 },
            hitta: { targetCount: 4, randomCount: 20, extraLetters: '' },
            math: { 
                penguinMaxBase: 10, 
                feedScore: 30,
                penguinModes: ['count', 'add', 'sub', 'mult'],
                feedModes: ['count', 'add', 'sub', 'mult'],
                dotsModes: ['count', 'add', 'sub', 'mult'],
                maxResults: { count: 50, add: 50, sub: 50, mult: 50 }
            },
            targetProgress: 20
        };
        this.progressCount = 1;
        this.tempConfig = null;
        this.loadState();
        this.loadConfig();
        this.init();
    }

    saveState() {
        localStorage.setItem('spelGrabbarnaState', JSON.stringify(this.state));
    }

    loadState() {
        const saved = localStorage.getItem('spelGrabbarnaState');
        if (saved) {
            const parsed = JSON.parse(saved);
            this.state = { ...this.state, ...parsed };
            if (this.state.progress) {
                this.progressCount = parseInt(this.state.progress.split(' / ')[0]) || 1;
            }
            if (typeof this.state.level !== 'number' || isNaN(this.state.level)) {
                this.state.level = 1;
            }
            if (!this.state.purchasedItems) {
                this.state.purchasedItems = [];
            }
        }
        this.state.currentScreen = 'loading-screen';
    }

    incrementProgress() {
        if (typeof this.state.level !== 'number' || isNaN(this.state.level)) {
            this.state.level = 1;
        }
        
        this.progressCount++;
        const target = this.config.targetProgress || 20;
        
        if (this.progressCount >= target) {
            this.state.level++;
            this.progressCount = 0;
            this.state.progress = `0 / ${target}`;
            this.showToast(`LEVEL UP! Du är nu på nivå ${this.state.level}! 🎉🏆`, 5000);
        } else {
            this.state.progress = `${this.progressCount} / ${target}`;
        }
        
        const progEl = document.querySelector('.hud-progress');
        if (progEl) progEl.innerText = this.state.progress;
        
        this.cheer('jump');
        this.saveState();
    }

    saveConfig() {
        localStorage.setItem('spelGrabbarnaConfig', JSON.stringify(this.config));
    }

    loadConfig() {
        const saved = localStorage.getItem('spelGrabbarnaConfig');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.config = { ...this.config, ...parsed };
                if (parsed.math) this.config.math = { ...this.config.math, ...parsed.math };
                if (parsed.adventure) this.config.adventure = { ...this.config.adventure, ...parsed.adventure };
                if (parsed.hitta) this.config.hitta = { ...this.config.hitta, ...parsed.hitta };
            } catch (e) {
                console.error("Kunde inte ladda inställningar", e);
            }
        }
    }

    init() {
        console.log("Spel-Grabbarna v2.0 - Modulär arkitektur");
        this.appEl = document.getElementById('app');
        this.loadScreens();
        window.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));
        window.addEventListener('hashchange', () => this.handleHashChange());
        
        setTimeout(() => {
            if (window.location.hash) {
                this.handleHashChange();
                return;
            }
            if (this.state.user && this.state.avatar) {
                this.updateMainMenuScreen();
                this.showScreen('main-menu');
            } else {
                this.showScreen('user-select');
            }
        }, 1000);
    }

    loadScreens() {
        const ids = [
            'loading-screen', 'user-select', 'avatar-select', 'difficulty-select', 
            'main-menu', 'game-stava', 'game-hitta', 'game-adventure', 
            'math-menu', 'game-math-penguin', 'game-math-feed', 
            'game-math-dots', 'dots-menu', 'penguin-menu', 'feed-menu', 
            'admin-menu', 'stories', 'spel-menu', 'game-pop', 'game-catch', 'game-race', 'game-whack', 'game-space', 'game-bubble', 'letter-menu', 'word-menu', 'game-memory', 'game-rabbla', 'game-ljuda', 'shop', 'password-screen',
            'profile-screen', 'wheel-screen', 'creator-screen'
        ];
        ids.forEach(id => {
            this.screens[id] = document.getElementById(id);
        });
    }

    handleHashChange() {
        const hash = window.location.hash.replace('#', '');
        if (hash && this.screens[hash]) {
            if (!this.state.user && hash !== 'user-select' && hash !== 'loading-screen' && hash !== 'admin-menu' && hash !== 'password-screen') {
                this.showScreen('user-select');
                return;
            }
            this.showScreen(hash, false);
        }
    }

    handleGlobalKeyDown(e) {
        if (e.key === 'Escape') {
            const backMap = {
                'math-menu': 'main-menu',
                'penguin-menu': 'math-menu',
                'feed-menu': 'math-menu',
                'dots-menu': 'math-menu',
                'game-math-penguin': 'penguin-menu',
                'game-math-feed': 'feed-menu',
                'game-math-dots': 'dots-menu',
                'difficulty-select': 'avatar-select',
                'avatar-select': 'user-select',
                'admin-menu': 'main-menu',
                'stories': 'main-menu',
                'game-stava': 'word-menu',
                'game-ljuda': 'word-menu',
                'game-hitta': 'letter-menu',
                'game-memory': 'letter-menu',
                'game-rabbla': 'letter-menu',
                'letter-menu': 'main-menu',
                'word-menu': 'main-menu',
                'game-adventure': 'main-menu',
                'password-screen': 'main-menu'
            };
            const target = backMap[this.state.currentScreen] || 'main-menu';
            this.showScreen(target);
        }
    }

    addScore(points) {
        if (!points) return;
        this.state.score += points;
        this.saveState();
        
        document.querySelectorAll('.hud-stats span:last-child').forEach(el => {
            el.innerText = this.state.score;
        });
        
        document.querySelectorAll('.hud-stats').forEach(el => {
            el.style.transform = 'scale(1.2)';
            setTimeout(() => el.style.transform = 'scale(1)', 200);
        });

        this.cheer(points > 50 ? 'jump' : 'wave');
        if (this.state.score >= 100) this.completeQuest('stars');
    }

    showScreen(screenId, updateHash = true) {
        if (this.state.currentScreen === 'admin-menu' && screenId !== 'admin-menu') {
            this._adminAuthenticated = false;
        }

        if (screenId === this.state.currentScreen && !['password-screen'].includes(screenId)) return;

        if (screenId === 'admin-menu' && !this._adminAuthenticated) {
            this._targetAfterAuth = 'admin-menu';
            this.showScreen('password-screen', false);
            return;
        }

        Object.keys(this.screens).forEach(id => {
            if (this.screens[id]) this.screens[id].classList.add('hidden');
        });
        
        const screen = this.screens[screenId];
        if (screen) {
            screen.classList.remove('hidden');
            this.state.currentScreen = screenId;
            if (updateHash) {
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, null, '#' + screenId);
                } else {
                    window.location.hash = screenId;
                }
            }

            const gameScreens = ['game-stava', 'game-hitta', 'game-adventure', 'game-math-penguin', 'game-math-feed', 'game-math-dots', 'game-pop', 'game-catch', 'game-race', 'game-whack', 'game-space', 'game-bubble', 'game-memory'];
            if (gameScreens.includes(screenId)) {
                // If entering a NEW game from a menu, reset progress to 1
                if (!gameScreens.includes(this._lastScreen)) {
                    this.progressCount = 1;
                    const target = this.config.targetProgress || 20;
                    this.state.progress = `1 / ${target}`;
                    const progressEl = document.querySelector('.hud-progress');
                    if (progressEl) progressEl.innerText = this.state.progress;
                }
            }
            this._lastScreen = screenId;
            
            if (screenId === 'password-screen') this.renderPasswordScreen();
            if (screenId === 'admin-menu' && this.updateAdminScreen) {
                this.tempConfig = JSON.parse(JSON.stringify(this.config));
                this.updateAdminScreen();
            }
            if (screenId === 'user-select' && this.updateUserSelectScreen) this.updateUserSelectScreen();
            if (screenId === 'main-menu' && this.updateMainMenuScreen) {
                this.generateDailyQuests();
                this.updateMainMenuScreen();
            }
            if (screenId === 'shop' && this.updateShopScreen) {
                this.updateShopScreen();
                this.completeQuest('shop');
            }
            if (screenId === 'profile-screen' && this.renderProfileScreen) this.renderProfileScreen();
            if (screenId === 'wheel-screen' && this.renderWheelScreen) {
                this.renderWheelScreen();
                this.completeQuest('spin');
            }
            if (screenId === 'creator-screen' && this.initCreatorScreen) {
                this.initCreatorScreen();
                this.completeQuest('draw');
            }
            if (screenId === 'math-menu' && this.updateMathMenuScreen) this.updateMathMenuScreen();
            if (screenId === 'dots-menu' && this.updateDotsMenuScreen) this.updateDotsMenuScreen();
            if (screenId === 'penguin-menu' && this.updatePenguinMenuScreen) this.updatePenguinMenuScreen();
            if (screenId === 'feed-menu' && this.updateFeedMenuScreen) this.updateFeedMenuScreen();
            if (screenId === 'avatar-select' && this.updateAvatarSelectScreen) this.updateAvatarSelectScreen();
            if (screenId === 'difficulty-select' && this.updateDifficultySelectScreen) this.updateDifficultySelectScreen();
            if (screenId === 'stories' && this.updateStoriesScreen) {
                this.updateStoriesScreen();
                this.completeQuest('story');
            }
            if (screenId === 'game-stava' && this.renderStava) { 
                this.currentWord = null; 
                this.currentGuessedCount = 0; 
                this.renderStava(); 
            }
            if (screenId === 'game-hitta' && this.initHittaGame) this.initHittaGame();
            if (screenId === 'game-adventure' && this.initAdventureGame) this.initAdventureGame();
            
            if (screenId === 'game-math-penguin' && !this._initializingMath && this.initMathGame) {
                this._initializingMath = true;
                this.initMathGame('count');
                this._initializingMath = false;
            }
            if (screenId === 'game-math-feed' && !this._initializingMath && this.initMathGame) {
                this._initializingMath = true;
                this.initMathGame('feed');
                this._initializingMath = false;
            }
            if (screenId === 'game-math-dots' && !this._initializingMath && this.initMathGame) {
                this._initializingMath = true;
                this.initMathGame('dots');
                this._initializingMath = false;
            }

            if (screenId === 'stories' && this.renderStoriesList) this.renderStoriesList();
            if (screenId === 'spel-menu' && this.updateSpelMenuScreen) this.updateSpelMenuScreen();
            if (screenId === 'letter-menu' && this.updateLetterMenuScreen) this.updateLetterMenuScreen();
            if (screenId === 'word-menu' && this.updateWordMenuScreen) this.updateWordMenuScreen();
            if (screenId === 'game-pop' && this.initGamePop) this.initGamePop();
            if (screenId === 'game-catch' && this.initGameCatch) this.initGameCatch();
            if (screenId === 'game-race' && this.initGameRace) this.initGameRace();
            if (screenId === 'game-whack' && this.initGameWhack) this.initGameWhack();
            if (screenId === 'game-space' && this.initGameSpace) this.initGameSpace();
            if (screenId === 'game-bubble' && this.initGameBubble) this.initGameBubble();
            if (screenId === 'game-memory' && this.initGameMemory) this.initGameMemory();
            if (screenId === 'game-rabbla' && this.initGameRabbla) this.initGameRabbla();
            if (screenId === 'game-ljuda' && this.initGameLjuda) this.initGameLjuda();
            
            if (screenId === 'profile-screen' && this.renderProfileScreen) this.renderProfileScreen();
            if (screenId === 'wheel-screen' && this.renderWheelScreen) this.renderWheelScreen();
            if (screenId === 'creator-screen' && this.initCreatorScreen) this.initCreatorScreen();
        }
    }

    renderPasswordScreen() {
        const div = this.screens['password-screen'];
        div.innerHTML = `
            <div class="screen-content" style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 50px; height: 100vh; background: var(--bg-color);">
                <div class="game-card" style="max-width: 400px; padding: 40px; text-align: center; border: 4px solid var(--color-william); box-shadow: 0 0 50px rgba(74, 144, 226, 0.2);">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <h2 style="margin-bottom: 10px;">Endast vuxna</h2>
                    <p style="color: #718096; margin-bottom: 30px;">Skriv in lösenordet för att komma till inställningar.</p>
                    
                    <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 30px;">
                        <input type="password" id="admin-pass-input" maxlength="4" style="width: 200px; height: 60px; font-size: 2.5rem; text-align: center; border-radius: 15px; border: 3px solid #2D3748; background: #1A202C; color: white; letter-spacing: 10px;" autofocus>
                    </div>

                    <div style="display: flex; gap: 15px; flex-direction: column;">
                        <button class="menu-card" style="width: 100%; justify-content: center; background: #718096; border-color: #4A5568;" onclick="window.gameApp.showScreen('main-menu')">Avbryt</button>
                    </div>
                </div>
            </div>
        `;
        
        const input = document.getElementById('admin-pass-input');
        if (input) {
            input.focus();
            input.oninput = (e) => {
                if (input.value.length === 4) {
                    this.checkAdminPassword();
                }
            };
            input.onkeydown = (e) => {
                if (e.key === 'Enter') this.checkAdminPassword();
            };
        }
    }

    checkAdminPassword() {
        const input = document.getElementById('admin-pass-input');
        if (!input) return;
        
        if (input.value === '7851') {
            this._adminAuthenticated = true;
            this.showScreen(this._targetAfterAuth || 'admin-menu');
        } else {
            this.showToast("Fel lösenord! 🛑", 2000);
            input.value = '';
            input.focus();
            
            // Shake effect
            const card = input.closest('.game-card');
            if (card) {
                card.style.animation = 'shake 0.4s';
                setTimeout(() => card.style.animation = '', 400);
            }
        }
    }

    cheer(type = 'jump', message = null) {
        const cheerleader = document.getElementById('cheerleader');
        const bubble = document.getElementById('cheer-bubble');
        if (!cheerleader) return;

        cheerleader.classList.remove('jump', 'wave');
        void cheerleader.offsetWidth; // Force reflow
        cheerleader.classList.add(type);

        if (message && bubble) {
            bubble.innerText = message;
            bubble.classList.add('show');
            setTimeout(() => bubble.classList.remove('show'), 3000);
        } else if (bubble && Math.random() < 0.3) {
            const messages = ['Heja dig! 🌟', 'Snyggt jobbat! 👏', 'Wow! ✨', 'Kanon! 🏆', 'Grymt! 🔥', 'Stjärna! ⭐'];
            bubble.innerText = messages[Math.floor(Math.random() * messages.length)];
            bubble.classList.add('show');
            setTimeout(() => bubble.classList.remove('show'), 2000);
        }
    }

    showToast(text, duration) {
        const d = duration || this.config.toastDuration || 3000;
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = text;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, d);
    }

    generateDailyQuests() {
        const today = new Date().toDateString();
        if (this.state.lastQuestDate === today && this.state.dailyQuests.length > 0) return;

        const pool = [
            { id: 'math', text: 'Räkna med djuren 🔢', reward: 50 },
            { id: 'spell', text: 'Stava ett ord rätt ✏️', reward: 40 },
            { id: 'story', text: 'Läs en hel saga 📖', reward: 50 },
            { id: 'letters', text: 'Hitta 10 bokstäver 🔤', reward: 30 },
            { id: 'draw', text: 'Skapa ett konstverk 🎨', reward: 30 },
            { id: 'spin', text: 'Snurra Lyckohjulet 🎡', reward: 20 }
        ];

        // Pick 3 random
        const shuffled = pool.sort(() => 0.5 - Math.random());
        this.state.dailyQuests = shuffled.slice(0, 3).map(q => ({ ...q, done: false }));
        this.state.lastQuestDate = today;
        this.saveState();
    }

    completeQuest(id) {
        const quest = this.state.dailyQuests.find(q => q.id === id && !q.done);
        if (quest) {
            quest.done = true;
            this.addScore(quest.reward);
            this.showToast(`UPPDRAG KLART! +${quest.reward} stjärnor 🌟🏆`, 4000);
            this.saveState();
            if (this.state.currentScreen === 'main-menu') this.updateMainMenuScreen();
        }
    }

    toggleBedtimeMode() {
        this.state.bedtimeMode = !this.state.bedtimeMode;
        this.applyBedtimeMode();
        this.saveState();
        this.showToast(this.state.bedtimeMode ? 'God natt! 🌙 Sovläge aktiverat.' : 'God morgon! ☀️ Vanligt läge.', 3000);
    }

    applyBedtimeMode() {
        if (this.state.bedtimeMode) {
            document.body.classList.add('bedtime-theme');
        } else {
            document.body.classList.remove('bedtime-theme');
        }
    }
}

window.gameApp = new App();
