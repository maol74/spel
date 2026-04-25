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
            purchasedItems: []
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
                penguinMaxBase: 5, 
                feedScore: 30,
                penguinModes: ['count', 'add', 'sub', 'mult'],
                feedModes: ['count', 'add', 'sub', 'mult'],
                dotsModes: ['count', 'add', 'sub', 'mult'],
                maxResults: { count: 20, add: 10, sub: 10, mult: 20 }
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
        
        const levelEl = document.querySelector('.hud-level');
        if (levelEl) levelEl.innerText = `NIVÅ ${this.state.level + 3}`; // Assuming difficulty + 3 is the visual level, but wait, UI uses this.state.difficulty + 3? Let's not touch hud-level text here unless we have to, UI.js sets it.
        
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
        window.location.hash = '';
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
            'admin-menu', 'stories', 'spel-menu', 'game-pop', 'game-catch', 'game-race', 'game-whack', 'game-space', 'game-bubble', 'letter-menu', 'word-menu', 'game-memory', 'game-rabbla', 'game-ljuda', 'shop'
        ];
        ids.forEach(id => {
            this.screens[id] = document.getElementById(id);
        });
    }

    handleHashChange() {
        const hash = window.location.hash.replace('#', '');
        if (hash && this.screens[hash]) {
            if (!this.state.user && hash !== 'user-select' && hash !== 'loading-screen' && hash !== 'admin-menu') {
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
                'game-adventure': 'main-menu'
            };
            const target = backMap[this.state.currentScreen] || 'main-menu';
            this.showScreen(target);
        }
    }

    showScreen(screenId, updateHash = true) {
        Object.keys(this.screens).forEach(id => {
            if (this.screens[id]) this.screens[id].classList.add('hidden');
        });
        
        const screen = this.screens[screenId];
        if (screen) {
            screen.classList.remove('hidden');
            this.state.currentScreen = screenId;
            if (updateHash) window.location.hash = screenId;

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

            if (screenId === 'admin-menu' && this.updateAdminScreen) {
                this.tempConfig = JSON.parse(JSON.stringify(this.config));
                this.updateAdminScreen();
            }
            if (screenId === 'user-select' && this.updateUserSelectScreen) this.updateUserSelectScreen();
            if (screenId === 'main-menu' && this.updateMainMenuScreen) this.updateMainMenuScreen();
            if (screenId === 'shop' && this.updateShopScreen) this.updateShopScreen();
            if (screenId === 'math-menu' && this.updateMathMenuScreen) this.updateMathMenuScreen();
            if (screenId === 'dots-menu' && this.updateDotsMenuScreen) this.updateDotsMenuScreen();
            if (screenId === 'penguin-menu' && this.updatePenguinMenuScreen) this.updatePenguinMenuScreen();
            if (screenId === 'feed-menu' && this.updateFeedMenuScreen) this.updateFeedMenuScreen();
            if (screenId === 'avatar-select' && this.updateAvatarSelectScreen) this.updateAvatarSelectScreen();
            if (screenId === 'difficulty-select' && this.updateDifficultySelectScreen) this.updateDifficultySelectScreen();
            if (screenId === 'game-stava' && this.renderStava) { 
                this.currentWord = null; 
                this.currentGuessedCount = 0; 
                this.renderStava(); 
            }
            if (screenId === 'game-hitta' && this.initHittaGame) this.initHittaGame();
            if (screenId === 'game-adventure' && this.initAdventureGame) this.initAdventureGame();
            if (screenId === 'game-math-penguin' && !this._initializingMath && this.initMathGame) {
                this._initializingMath = true;
                this.initMathGame(this.mathMode || 'count');
                this._initializingMath = false;
            }
            if (screenId === 'game-math-feed' && !this._initializingFeed && this.initMathFeedGame) {
                this._initializingFeed = true;
                this.initMathFeedGame(this.feedMode || 'count');
                this._initializingFeed = false;
            }
            if (screenId === 'game-math-dots' && !this._initializingDots && this.initMathDotsGame) {
                this._initializingDots = true;
                this.initMathDotsGame(this.dotsMode || 'count');
                this._initializingDots = false;
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
        }
    }

    cheer() {
        const cheers = ['Snyggt jobbat!', 'Heja dig!', 'Wow, vad duktig du är!', 'Kanonbra!', 'Stjärna! ⭐', 'Helt rätt!', 'Grymt!', 'Superbra!'];
        return cheers[Math.floor(Math.random() * cheers.length)];
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
    },

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
    }
}

window.gameApp = new App();
