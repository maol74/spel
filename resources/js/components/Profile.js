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
            <div class="game-card" style="max-width: 800px; margin: 40px auto; padding: 40px; text-align: center;">
                <div style="font-size: 6rem; margin-bottom: 20px; animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);">📸</div>
                <h1 style="color: ${user.color}; margin-bottom: 10px;">${user.name}s Profil</h1>
                <p style="color: #A0AEC0; margin-bottom: 40px;">${user.age} år • Nivå ${this.state.level || 1}</p>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px;">
                    <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 20px; border: 2px solid #F1C40F;">
                        <div style="font-size: 2rem; margin-bottom: 5px;">⭐</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #F1C40F;">${this.state.score}</div>
                        <div style="font-size: 0.8rem; color: #A0AEC0; text-transform: uppercase;">Stjärnor</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.2); padding: 20px; border-radius: 20px; border: 2px solid #2ECC71;">
                        <div style="font-size: 2rem; margin-bottom: 5px;">🏆</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #2ECC71;">${this.state.level || 1}</div>
                        <div style="font-size: 0.8rem; color: #A0AEC0; text-transform: uppercase;">Hjältenivå</div>
                    </div>
                </div>

                <h2 style="text-align: left; margin-bottom: 20px; color: white;">Mina Märken 🏅</h2>
                <div style="display: flex; gap: 15px; overflow-x: auto; padding: 10px 0;">
                    ${badges.map(b => `
                        <div class="badge-item" style="min-width: 120px; background: #2D3748; padding: 20px 10px; border-radius: 20px; border: 3px solid ${b.date === 'Snart...' ? '#4A5568' : '#F1C40F'}; opacity: ${b.date === 'Snart...' ? 0.4 : 1};">
                            <div style="font-size: 2.5rem; margin-bottom: 10px;">${b.icon}</div>
                            <div style="font-weight: bold; font-size: 0.9rem;">${b.name}</div>
                            <div style="font-size: 0.7rem; color: #718096; margin-top: 5px;">${b.date}</div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 50px;">
                    <button class="menu-card" style="width: auto; padding: 15px 40px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Äventyret 🏠</button>
                </div>
            </div>
            ${this.getCheerleader()}
        `;
    }
});
