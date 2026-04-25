Object.assign(App.prototype, {
    updateAdminScreen() {
        const div = this.screens['admin-menu'];
        const conf = this.tempConfig || this.config;
        
        const renderModeCheckboxes = (gameKey, modesKey) => {
            const allModes = [
                { id: 'count', label: 'Räkna', icon: '🔢' },
                { id: 'add', label: 'Plus (+)', icon: '➕' },
                { id: 'sub', label: 'Minus (-)', icon: '➖' },
                { id: 'mult', label: 'Gånger (×)', icon: '✖️' }
            ];
            const currentModes = (conf.math && conf.math[modesKey]) || [];
            const maxVals = conf.math.maxResults || { count: 20, add: 10, sub: 10, mult: 20 };
            
            return allModes.map(m => `
                <div style="display: flex; flex-direction: column; gap: 5px; background: #2D3748; padding: 15px; border-radius: 12px; border: 1px solid #4A5568;">
                    <label style="display: flex; align-items: center; gap: 10px; color: #fff; cursor: pointer; font-weight: bold; margin-bottom: 8px;">
                        <input type="checkbox" ${currentModes.includes(m.id) ? 'checked' : ''} 
                               onchange="window.gameApp.toggleAdminMode('${modesKey}', '${m.id}')"
                               style="width: 20px; height: 20px;">
                        ${m.icon} ${m.label}
                    </label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="color: #A0AEC0; font-size: 0.8rem;">Max svar:</span>
                        <input type="number" value="${maxVals[m.id]}" 
                               onchange="window.gameApp.updateMathMax('${m.id}', this.value)"
                               style="width: 60px; padding: 5px 8px; border-radius: 6px; background: #1A202C; border: 1px solid #4A5568; color: #fff; font-size: 0.9rem;">
                    </div>
                </div>
            `).join('');
        };

        div.innerHTML = `
            ${this.getHUD()}
            <h1 style="margin-top: 100px;">⚙️ Admin-inställningar</h1>
            <div class="game-card" style="width: 100%; max-width: 800px; text-align: left; padding: 40px; background: rgba(26, 38, 43, 0.9); margin-bottom: 50px;">
                <div class="admin-section">
                    <h3 style="color: #4A90E2; border-bottom: 1px solid #2D3748; padding-bottom: 10px;">Allmänt</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                        <div>
                            <label style="display: block; color: #fff; margin-bottom: 5px;">Meddelande-tid (ms):</label>
                            <input type="number" value="${conf.toastDuration}" onchange="window.gameApp.updateTempConfig('toastDuration', null, this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff;">
                        </div>
                        <div>
                            <label style="display: block; color: #fff; margin-bottom: 5px;">Antal spel för nivå:</label>
                            <input type="number" value="${conf.targetProgress}" onchange="window.gameApp.updateTempConfig('targetProgress', null, this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff;">
                        </div>
                    </div>
                </div>

                <div class="admin-section">
                    <h3 style="color: #F1C40F; border-bottom: 1px solid #2D3748; padding-bottom: 10px; margin-top: 30px;">Hjälte-Hoppet (Äventyr)</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                        <div>
                            <label style="display: block; color: #fff; margin-bottom: 5px;">Mål-poäng:</label>
                            <input type="number" value="${conf.adventure.targetScore}" onchange="window.gameApp.updateTempConfig('adventure', 'targetScore', this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff;">
                        </div>
                        <div>
                            <label style="display: block; color: #fff; margin-bottom: 5px;">Basfart:</label>
                            <input type="number" value="${conf.adventure.baseSpeed}" onchange="window.gameApp.updateTempConfig('adventure', 'baseSpeed', this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff;">
                        </div>
                    </div>
                </div>

                <div class="admin-section">
                    <h3 style="color: #2ECC71; border-bottom: 1px solid #2D3748; padding-bottom: 10px; margin-top: 30px;">Hitta Bokstaven</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                        <div>
                            <label style="display: block; color: #fff; margin-bottom: 5px;">Antal att hitta:</label>
                            <input type="number" value="${conf.hitta.targetCount}" onchange="window.gameApp.updateTempConfig('hitta', 'targetCount', this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff;">
                        </div>
                        <div>
                            <label style="display: block; color: #fff; margin-bottom: 5px;">Andra bokstäver:</label>
                            <input type="number" value="${conf.hitta.randomCount}" onchange="window.gameApp.updateTempConfig('hitta', 'randomCount', this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff;">
                        </div>
                    </div>
                    <div style="margin-top: 15px;">
                        <label style="display: block; color: #fff; margin-bottom: 5px;">Extra bokstäver att träna på (komma-separerat):</label>
                        <input type="text" placeholder="t.ex. S,R,Å" value="${conf.hitta.extraLetters || ''}" onchange="window.gameApp.updateTempConfig('hitta', 'extraLetters', this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff;">
                    </div>
                </div>

                <div class="admin-section">
                    <h3 style="color: #E67E22; border-bottom: 1px solid #2D3748; padding-bottom: 10px; margin-top: 30px;">Pingvinhopp (Matte)</h3>
                    <div style="margin: 20px 0;">
                        <label style="display: block; color: #fff; margin-bottom: 5px;">Antal hopp:</label>
                        <input type="number" value="${conf.math.penguinMaxBase}" onchange="window.gameApp.updateTempConfig('math', 'penguinMaxBase', this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff; margin-bottom: 15px;">
                        <label style="display: block; color: #fff; margin-bottom: 10px;">Tillåtna räknesätt:</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            ${renderModeCheckboxes('math', 'penguinModes')}
                        </div>
                    </div>
                </div>

                <div class="admin-section">
                    <h3 style="color: #E91E63; border-bottom: 1px solid #2D3748; padding-bottom: 10px; margin-top: 30px;">Mata Djuren (Matte)</h3>
                    <div style="margin: 20px 0;">
                        <label style="display: block; color: #fff; margin-bottom: 5px;">Poäng vid vinst:</label>
                        <input type="number" value="${conf.math.feedScore}" onchange="window.gameApp.updateTempConfig('math', 'feedScore', this.value)" style="width: 100%; padding: 12px; border-radius: 10px; background: #2D3748; border: none; color: #fff; margin-bottom: 15px;">
                        <label style="display: block; color: #fff; margin-bottom: 10px;">Tillåtna räknesätt:</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            ${renderModeCheckboxes('math', 'feedModes')}
                        </div>
                    </div>
                </div>

                <div class="admin-section">
                    <h3 style="color: #4CAF50; border-bottom: 1px solid #2D3748; padding-bottom: 10px; margin-top: 30px;">Prick till Prick (Matte)</h3>
                    <div style="margin: 20px 0;">
                        <label style="display: block; color: #fff; margin-bottom: 10px;">Tillåtna räknesätt:</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            ${renderModeCheckboxes('math', 'dotsModes')}
                        </div>
                    </div>
                </div>

                <div style="margin-top: 40px; display: flex; gap: 20px;">
                    <button class="menu-card" style="width: auto; padding: 15px 40px; background: #4A90E2; border: none; color: white; font-weight: bold;" onclick="window.gameApp.saveAdminChanges()">Spara & Tillbaka</button>
                    <button class="menu-card" style="width: auto; padding: 15px 30px; background: transparent; border-color: #95A5A6; color: #95A5A6;" onclick="window.gameApp.showScreen('main-menu')">Avbryt</button>
                    <button class="menu-card" style="width: auto; padding: 15px 30px; background: #E74C3C; border: none; color: white;" onclick="window.gameApp.resetConfig()">Återställ allt</button>
                </div>
            </div>
        `;
    },

    updateTempConfig(key, subkey, value) {
        const val = parseFloat(value);
        if (subkey) { this.tempConfig[key][subkey] = val; } 
        else { this.tempConfig[key] = val; }
    },

    toggleAdminMode(modesKey, modeId) {
        if (!this.tempConfig.math[modesKey]) this.tempConfig.math[modesKey] = [];
        const modes = this.tempConfig.math[modesKey];
        const idx = modes.indexOf(modeId);
        if (idx > -1) { modes.splice(idx, 1); } 
        else { modes.push(modeId); }
        this.updateAdminScreen();
    },

    updateMathMax(modeId, value) {
        if (!this.tempConfig.math.maxResults) {
            this.tempConfig.math.maxResults = { count: 20, add: 10, sub: 10, mult: 20 };
        }
        this.tempConfig.math.maxResults[modeId] = parseInt(value) || 10;
        this.updateAdminScreen();
    },

    saveAdminChanges() {
        this.config = JSON.parse(JSON.stringify(this.tempConfig));
        this.saveConfig();
        this.showToast('Inställningar sparade! ✅');
        this.showScreen('main-menu');
    },

    resetConfig() {
        if (confirm('Är du säker på att du vill återställa alla inställningar?')) {
            localStorage.removeItem('spelGrabbarnaConfig');
            location.reload();
        }
    }
});
