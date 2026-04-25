Object.assign(App.prototype, {
    updateShopScreen() {
        if (!this.screens['shop']) return;
        const div = this.screens['shop'];
        
        const availableAvatars = CONFIG.avatars;
        
        div.innerHTML = `
            ${this.getHUD()}
            <h1>Stjärn-butiken 🛒</h1>
            <p style="color: #CBD5E0; margin-bottom: 2rem;">Köp nya figurer för dina stjärnor!</p>
            
            <div style="background: rgba(26, 38, 43, 0.9); padding: 30px; border-radius: 20px; border: 3px solid #F1C40F; max-width: 900px; width: 95%;">
                <div style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 30px;">
                    <span style="font-size: 2rem;">Dina stjärnor:</span>
                    <span style="font-size: 2.5rem; font-weight: bold; color: #F1C40F;">⭐ ${this.state.score}</span>
                </div>
                
                <div class="menu-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    ${availableAvatars.filter(a => a.price > 0).map(a => {
                        const isPurchased = this.state.purchasedItems.includes(a.id);
                        const canAfford = this.state.score >= a.price;
                        
                        if (isPurchased) {
                            return `
                                <div class="menu-card" style="border-color: #2ECC71; flex-direction: column; text-align: center; cursor: default;">
                                    <div class="menu-card-icon" style="margin-bottom: 10px;">${a.icon}</div>
                                    <div class="menu-card-title" style="color: #2ECC71;">${a.name}</div>
                                    <div style="color: #2ECC71; font-weight: bold; margin-top: 10px;">Köpt! ✅</div>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="menu-card" style="border-color: ${canAfford ? '#F1C40F' : '#718096'}; flex-direction: column; text-align: center;" onclick="window.gameApp.buyItem('${a.id}')">
                                    <div class="menu-card-icon" style="margin-bottom: 10px; filter: ${canAfford ? 'none' : 'grayscale(100%) opacity(50%)'};">${a.icon}</div>
                                    <div class="menu-card-title" style="color: white;">${a.name}</div>
                                    <div style="background: ${canAfford ? '#F1C40F' : '#718096'}; color: ${canAfford ? '#000' : '#FFF'}; padding: 5px 15px; border-radius: 10px; font-weight: bold; margin-top: 10px;">
                                        ${a.price} ⭐
                                    </div>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
            </div>
            <div style="margin-top: 40px;"><button class="menu-card" style="width: auto; padding: 10px 30px;" onclick="window.gameApp.showScreen('main-menu')">Tillbaka till Start</button></div>
        `;
    },

    buyItem(id) {
        const item = CONFIG.avatars.find(a => a.id === id);
        if (!item || item.price === 0) return;
        
        if (this.state.purchasedItems.includes(id)) {
            return; // Already purchased
        }
        
        if (this.state.score >= item.price) {
            this.state.score -= item.price;
            this.state.purchasedItems.push(id);
            this.saveState();
            this.showToast(`Du köpte ${item.name}! 🎉`, 4000);
            
            // Re-render HUD to update score
            this.updateShopScreen();
        } else {
            this.showToast(`Du behöver ${item.price - this.state.score} fler stjärnor! 😢`, 3000);
        }
    }
});
