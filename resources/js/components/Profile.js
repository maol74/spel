Object.assign(App.prototype, {
    renderProfileScreen() {
        const div = this.screens['profile-screen'];
        const user = this.state.user || { name: 'Kompis', age: '?', color: '#4A90E2' };
        
        // Mock badges if empty
        const badges = this.state.badges.length > 0 ? this.state.badges : [
            { id: 'starter', name: 'Nybörjare', icon: '🌱', date: 'Idag' },
            { id: 'math', name: 'Matte-geni', icon: '🔢', date: 'Snart...' },
            { id: 'story', name: 'Sago-slukare', icon: '📖', date: 'Snart...' }
        ];

        div.innerHTML = `
            ${this.getHUD()}
            <div class="game-card" style="max-width: 800px; margin: 20px auto; padding: 30px; text-align: center; position: relative;">
                <!-- Camera icon moved to top-right as a decorative badge -->
                <div style="position: absolute; top: 20px; right: 30px; font-size: 3rem; animation: popIn 0.5s ease-out;">📸</div>
                
                <div style="margin-top: 10px;">
                    <h1 style="color: ${user.color}; margin-bottom: 5px; font-size: 2.5rem;">${user.name}s Profil</h1>
                    <p style="color: #A0AEC0; margin-bottom: 30px;">${user.age} år • Nivå ${this.state.level || 1}</p>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 20px; border: 2px solid #F1C40F;">
                        <div style="font-size: 1.8rem; margin-bottom: 5px;">⭐</div>
                        <div style="font-size: 1.4rem; font-weight: bold; color: #F1C40F;">${this.state.score}</div>
                        <div style="font-size: 0.7rem; color: #A0AEC0; text-transform: uppercase;">Stjärnor</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 20px; border: 2px solid #2ECC71;">
                        <div style="font-size: 1.8rem; margin-bottom: 5px;">🏆</div>
                        <div style="font-size: 1.4rem; font-weight: bold; color: #2ECC71;">${this.state.level || 1}</div>
                        <div style="font-size: 0.7rem; color: #A0AEC0; text-transform: uppercase;">Hjältenivå</div>
                    </div>
                </div>

                <div style="text-align: left; background: rgba(0,0,0,0.1); padding: 20px; border-radius: 25px;">
                    <h2 style="margin: 0 0 15px 0; color: white; font-size: 1.2rem;">Mina Märken 🏅</h2>
                    <div style="display: flex; gap: 15px; overflow-x: auto; padding: 5px 0; scrollbar-width: none;">
                        ${badges.map(b => `
                            <div class="badge-item" style="min-width: 100px; background: #2D3748; padding: 15px 10px; border-radius: 20px; border: 3px solid ${b.date === 'Snart...' ? '#4A5568' : '#F1C40F'}; opacity: ${b.date === 'Snart...' ? 0.4 : 1}; text-align: center;">
                                <div style="font-size: 2rem; margin-bottom: 5px;">${b.icon}</div>
                                <div style="font-weight: bold; font-size: 0.8rem; white-space: nowrap;">${b.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <button class="menu-card" style="width: auto; padding: 12px 30px; font-size: 1.1rem; margin: 0 auto;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Äventyret 🏠</button>
                </div>
            </div>
            <style>
                #profile-screen { padding-top: 100px !important; }
            </style>
            ${this.getCheerleader()}
        `;
    }
});
