// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Main Navigation
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    
    // DOM Elements - User Profile
    const loginModal = document.getElementById('login-modal');
    const usernameInput = document.getElementById('username-input');
    const loginButton = document.getElementById('login-button');
    const profileName = document.getElementById('profile-name');
    const profileStatus = document.getElementById('profile-status');
    const upgradeButton = document.querySelector('.upgrade-button');
    const vipButton = document.querySelector('.vip-button');
    const coinsElement = document.getElementById('coins');
    const winsElement = document.getElementById('wins');
    
    // DOM Elements - Free Games
    const discoverButton = document.querySelector('.discover-button');
    const startButton = document.querySelector('.start-button');
    const gamesGrid = document.querySelector('.games-grid');
    const fifaGames = document.getElementById('fifa-games');
    const baccaratBookmakers = document.getElementById('baccarat-bookmakers');
    const backButtons = document.querySelectorAll('.back-button');
    const selectGameButtons = document.querySelectorAll('.select-game-button');
    const nextButton = document.getElementById('fifa-next-button');
    const selectBookmakerButtons = document.querySelectorAll('.select-bookmaker-button');
    const createAccountButton = document.querySelector('.create-account-button');
    const bookmakerModal = document.getElementById('bookmaker-modal');
    const closeBookmakerModal = document.getElementById('close-bookmaker-modal');
    const gameInterface = document.getElementById('game-interface');
    const gameTitle = document.getElementById('game-title');
    const gameContent = document.getElementById('game-content');
    const backToGamesButton = document.querySelector('.back-to-games-button');
    
    // DOM Elements - Premium Games
    const premiumButtons = document.querySelectorAll('.premium-button[data-game]');
    const appleSettings = document.getElementById('apple-settings');
    const godmodeSettings = document.getElementById('godmode-settings');
    const segaSettings = document.getElementById('sega-settings');
    const startApplePrediction = document.getElementById('start-apple-prediction');
    const startGodmodePrediction = document.getElementById('start-godmode-prediction');
    const startSegaPrediction = document.getElementById('start-sega-prediction');
    const premiumGameInterface = document.getElementById('premium-game-interface');
    const premiumGameTitle = document.getElementById('premium-game-title');
    const premiumGameContent = document.getElementById('premium-game-content');
    const premiumNextButton = document.getElementById('premium-next-button');
    const premiumNewPredictionButton = document.getElementById('premium-new-prediction-button');
    const premiumHomeButton = document.getElementById('premium-home-button');
    
    // Game state
    let selectedFifaGame = null;
    let currentPalier = 0;
    
    // User data
    let userData = {
        username: '',
        isPremium: false,
        coins: 100,
        wins: 0
    };
    
    // Show login modal on page load if no username is stored
    if (!localStorage.getItem('betscale_username')) {
        showLoginModal();
    } else {
        // Load user data from local storage
        loadUserData();
        updateProfileUI();
    }
    
    // Initialize 3D effects
    initThreeJS();
    
    // Navigation buttons click event
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${section}-section`).classList.add('active');
            
            // Add animation to the active section
            document.getElementById(`${section}-section`).style.animation = 'fadeIn 0.3s ease-in-out';
            
            // Reset game view when navigating away
            resetGameView();
            resetPremiumGameView();
        });
    });
    
    // Login button click event
    loginButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        if (username) {
            userData.username = username;
            saveUserData();
            updateProfileUI();
            hideLoginModal();
        } else {
            // Shake the input to indicate error
            usernameInput.classList.add('shake');
            setTimeout(() => usernameInput.classList.remove('shake'), 500);
        }
    });
    
    // Upgrade to premium button click events
    upgradeButton.addEventListener('click', upgradeToPremium);
    vipButton.addEventListener('click', upgradeToPremium);
    
    // FIFA: Découvrir button click event
    discoverButton.addEventListener('click', function() {
        gamesGrid.style.display = 'none';
        fifaGames.classList.add('active');
        fifaGames.style.animation = 'fadeIn 0.3s ease-in-out';
    });
    
    // Baccarat: Commencer button click event
    startButton.addEventListener('click', function() {
        gamesGrid.style.display = 'none';
        baccaratBookmakers.classList.add('active');
        baccaratBookmakers.style.animation = 'fadeIn 0.3s ease-in-out';
    });
    
    // Premium games: Commencer button click events
    premiumButtons.forEach(button => {
        button.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            const vipGamesGrid = document.querySelector('.vip-games');
            vipGamesGrid.style.display = 'none';
            
            // Show appropriate settings
            if (game === 'apple') {
                appleSettings.classList.add('active');
            } else if (game === 'godmode') {
                godmodeSettings.classList.add('active');
            } else if (game === 'sega') {
                segaSettings.classList.add('active');
            }
        });
    });
    
    // Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.sub-games-container');
            if (container) {
                container.classList.remove('active');
                
                // Check if we're in the free games or premium games section
                if (container.id === 'fifa-games' || container.id === 'baccarat-bookmakers') {
                    // Free games section
                    gamesGrid.style.display = 'grid';
                    
                    // Reset selected FIFA game
                    selectedFifaGame = null;
                    selectGameButtons.forEach(btn => {
                        btn.parentElement.classList.remove('selected');
                        btn.textContent = 'Sélectionner';
                    });
                    nextButton.classList.add('disabled');
                } else {
                    // Premium games section
                    document.querySelector('.vip-games').style.display = 'grid';
                }
            }
        });
    });
    
    // Selection of FIFA game
    selectGameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            
            // Reset previous selection
            selectGameButtons.forEach(btn => {
                btn.parentElement.classList.remove('selected');
                btn.textContent = 'Sélectionner';
            });
            
            // Set new selection
            this.parentElement.classList.add('selected');
            this.textContent = 'Sélectionné ✓';
            selectedFifaGame = game;
            
            // Enable next button
            nextButton.classList.remove('disabled');
        });
    });
    
    // FIFA Next button
    nextButton.addEventListener('click', function() {
        if (selectedFifaGame) {
            fifaGames.classList.remove('active');
            gameInterface.classList.add('active');
            
            // Set game title and load content
            if (selectedFifaGame === 'fifa-england') {
                gameTitle.textContent = 'FC24 4x4 - Angleterre';
                loadFIFAGameContent('england');
            } else if (selectedFifaGame === 'fifa-master') {
                gameTitle.textContent = 'FC24 3x3 - Master League';
                loadFIFAGameContent('master');
            }
        }
    });
    
    // Select bookmaker buttons
    selectBookmakerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookmaker = this.getAttribute('data-bookmaker');
            
            // Hide bookmakers
            baccaratBookmakers.classList.remove('active');
            
            // Show game interface
            gameInterface.classList.add('active');
            
            // Set game title and load content
            gameTitle.textContent = 'Baccarat - Prédictions';
            loadBaccaratGameContent(bookmaker);
        });
    });
    
    // Apple of Fortune Start Prediction button
    startApplePrediction.addEventListener('click', function() {
        // Check if bookmaker is selected
        const selectedBookmaker = document.querySelector('input[name="apple-bookmaker"]:checked');
        if (!selectedBookmaker) {
            alert('Veuillez sélectionner un bookmaker');
            return;
        }
        
        // Hide settings
        appleSettings.classList.remove('active');
        
        // Show premium game interface
        premiumGameInterface.classList.add('active');
        
        // Set game title and load content
        premiumGameTitle.textContent = 'Apple of Fortune - Prédiction';
        loadAppleOfFortuneContent(selectedBookmaker.value);
    });
    
    // God Mode Start Prediction button
    startGodmodePrediction.addEventListener('click', function() {
        // Hide settings
        godmodeSettings.classList.remove('active');
        
        // Show premium game interface
        premiumGameInterface.classList.add('active');
        
        // Set game title and load content
        premiumGameTitle.textContent = 'God Mode - Prédiction';
        loadGodModeContent();
    });
    
    // Sega Football Start Prediction button
    startSegaPrediction.addEventListener('click', function() {
        // Hide settings
        segaSettings.classList.remove('active');
        
        // Show premium game interface
        premiumGameInterface.classList.add('active');
        
        // Set game title and load content
        premiumGameTitle.textContent = 'Sega Football - Prédiction';
        loadSegaFootballContent();
    });
    
    // Premium Next button
    premiumNextButton.addEventListener('click', function() {
        // Increase palier
        currentPalier++;
        
        if (currentPalier < 4) {
            // Load next palier prediction
            if (premiumGameTitle.textContent.includes('Apple of Fortune')) {
                loadAppleOfFortuneContent();
            } else if (premiumGameTitle.textContent.includes('God Mode')) {
                loadGodModeContent();
            } else if (premiumGameTitle.textContent.includes('Sega Football')) {
                loadSegaFootballContent();
            }
            
            // Update palier indicator
            updatePalierIndicator();
        }
        
        // Show special message at 4th palier
        if (currentPalier === 4) {
            const palierMessage = document.createElement('div');
            palierMessage.className = 'palier-message visible';
            palierMessage.textContent = "Notre modèle s'arrête au 4ᵉ palier car notre base de données montre que les résultats y sont les plus fiables.";
            premiumGameContent.appendChild(palierMessage);
            
            // Disable next button
            this.disabled = true;
            this.style.opacity = '0.5';
        }
    });
    
    // Premium New Prediction button
    premiumNewPredictionButton.addEventListener('click', function() {
        // Reset palier
        currentPalier = 0;
        
        // Reload current game
        if (premiumGameTitle.textContent.includes('Apple of Fortune')) {
            loadAppleOfFortuneContent();
        } else if (premiumGameTitle.textContent.includes('God Mode')) {
            loadGodModeContent();
        } else if (premiumGameTitle.textContent.includes('Sega Football')) {
            loadSegaFootballContent();
        }
        
        // Re-enable next button if disabled
        premiumNextButton.disabled = false;
        premiumNextButton.style.opacity = '1';
    });
    
    // Premium Home button
    premiumHomeButton.addEventListener('click', function() {
        resetPremiumGameView();
    });
    
    // Create account button
    createAccountButton.addEventListener('click', function() {
        showBookmakerModal();
    });
    
    // Close bookmaker modal
    closeBookmakerModal.addEventListener('click', function() {
        hideBookmakerModal();
    });
    
    // Back to games button
    backToGamesButton.addEventListener('click', function() {
        resetGameView();
    });
    
    // Functions
    function showLoginModal() {
        loginModal.classList.add('active');
        setTimeout(() => {
            usernameInput.focus();
        }, 300);
    }
    
    function hideLoginModal() {
        loginModal.classList.remove('active');
    }
    
    function showBookmakerModal() {
        bookmakerModal.classList.add('active');
    }
    
    function hideBookmakerModal() {
        bookmakerModal.classList.remove('active');
    }
    
    function loadUserData() {
        const savedUsername = localStorage.getItem('betscale_username');
        const savedPremium = localStorage.getItem('betscale_premium') === 'true';
        const savedCoins = parseInt(localStorage.getItem('betscale_coins') || '100');
        const savedWins = parseInt(localStorage.getItem('betscale_wins') || '0');
        
        userData = {
            username: savedUsername || '',
            isPremium: savedPremium,
            coins: savedCoins,
            wins: savedWins
        };
    }
    
    function saveUserData() {
        localStorage.setItem('betscale_username', userData.username);
        localStorage.setItem('betscale_premium', userData.isPremium);
        localStorage.setItem('betscale_coins', userData.coins);
        localStorage.setItem('betscale_wins', userData.wins);
    }
    
    function updateProfileUI() {
        profileName.textContent = userData.username;
        coinsElement.textContent = userData.coins;
        winsElement.textContent = userData.wins;
        
        if (userData.isPremium) {
            profileStatus.textContent = 'Plan Premium';
            profileStatus.classList.remove('free');
            profileStatus.classList.add('premium');
            upgradeButton.textContent = 'Déjà Premium';
            upgradeButton.disabled = true;
            upgradeButton.style.opacity = '0.7';
        } else {
            profileStatus.textContent = 'Plan Gratuit';
            profileStatus.classList.remove('premium');
            profileStatus.classList.add('free');
            upgradeButton.textContent = 'Passer Premium';
            upgradeButton.disabled = false;
            upgradeButton.style.opacity = '1';
        }
    }
    
    function upgradeToPremium() {
        if (!userData.isPremium) {
            // Simulate premium upgrade
            userData.isPremium = true;
            userData.coins += 500; // Bonus for upgrading
            saveUserData();
            updateProfileUI();
            
            // Show success message
            alert('Félicitations! Vous êtes maintenant un utilisateur Premium! +500 jetons bonus ajoutés.');
            
            // Switch to VIP section to show premium games
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-section="vip"]').classList.add('active');
            
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById('vip-section').classList.add('active');
        }
    }
    
    function resetGameView() {
        // Hide game interface and sub-games
        gameInterface.classList.remove('active');
        fifaGames.classList.remove('active');
        baccaratBookmakers.classList.remove('active');
        
        // Show game cards
        gamesGrid.style.display = 'grid';
        
        // Clear game content
        gameContent.innerHTML = '';
        
        // Reset selected game
        selectedFifaGame = null;
        selectGameButtons.forEach(btn => {
            btn.parentElement.classList.remove('selected');
            btn.textContent = 'Sélectionner';
        });
        nextButton.classList.add('disabled');
    }
    
    function resetPremiumGameView() {
        // Hide premium game interface and settings screens
        premiumGameInterface.classList.remove('active');
        appleSettings.classList.remove('active');
        godmodeSettings.classList.remove('active');
        segaSettings.classList.remove('active');
        
        // Show premium game cards
        document.querySelector('.vip-games').style.display = 'grid';
        
        // Clear premium game content
        premiumGameContent.innerHTML = '';
        
        // Reset palier counter
        currentPalier = 0;
        
        // Re-enable next button if disabled
        premiumNextButton.disabled = false;
        premiumNextButton.style.opacity = '1';
    }
    
    function updatePalierIndicator() {
        // Remove existing palier indicator
        const existingIndicator = document.querySelector('.palier-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create new palier indicator
        const palierIndicator = document.createElement('div');
        palierIndicator.className = 'palier-indicator';
        
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            dot.className = 'palier-dot';
            if (i <= currentPalier) {
                dot.classList.add('active');
            }
            palierIndicator.appendChild(dot);
        }
        
        // Insert at the top of the game content
        premiumGameContent.insertBefore(palierIndicator, premiumGameContent.firstChild);
    }
    
    function loadFIFAGameContent(league) {
        gameContent.innerHTML = '';
        
        // Create loading animation
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-animation';
        loadingDiv.textContent = 'Chargement des prédictions...';
        gameContent.appendChild(loadingDiv);
        
        // Simulate loading time
        setTimeout(() => {
            gameContent.innerHTML = '';
            
            // Add match predictions
            if (league === 'england') {
                // England 4x4 predictions
                const matches = [
                    {
                        teams: 'Manchester United vs Liverpool',
                        prediction: 'Liverpool Win',
                        homeOdds: '3.25',
                        drawOdds: '3.40',
                        awayOdds: '2.10',
                        confidence: 78
                    },
                    {
                        teams: 'Arsenal vs Chelsea',
                        prediction: 'Draw',
                        homeOdds: '2.50',
                        drawOdds: '3.20',
                        awayOdds: '2.80',
                        confidence: 65
                    },
                    {
                        teams: 'Manchester City vs Tottenham',
                        prediction: 'Manchester City Win',
                        homeOdds: '1.75',
                        drawOdds: '3.50',
                        awayOdds: '4.60',
                        confidence: 85
                    },
                    {
                        teams: 'Newcastle vs Aston Villa',
                        prediction: 'Newcastle Win',
                        homeOdds: '2.20',
                        drawOdds: '3.30',
                        awayOdds: '3.40',
                        confidence: 70
                    }
                ];
                
                createPredictionCards(matches);
            } else {
                // Master League 3x3 predictions
                const matches = [
                    {
                        teams: 'Real Madrid vs Barcelona',
                        prediction: 'Real Madrid Win',
                        homeOdds: '2.10',
                        drawOdds: '3.50',
                        awayOdds: '3.20',
                        confidence: 75
                    },
                    {
                        teams: 'Bayern Munich vs Borussia Dortmund',
                        prediction: 'Bayern Munich Win',
                        homeOdds: '1.85',
                        drawOdds: '3.60',
                        awayOdds: '4.20',
                        confidence: 80
                    },
                    {
                        teams: 'PSG vs Marseille',
                        prediction: 'PSG Win',
                        homeOdds: '1.65',
                        drawOdds: '3.80',
                        awayOdds: '5.00',
                        confidence: 88
                    }
                ];
                
                createPredictionCards(matches);
            }
            
            // Add bonus for generating predictions
            userData.coins += 5;
            saveUserData();
            updateProfileUI();
            
            // Show bonus message
            const bonusMessage = document.createElement('div');
            bonusMessage.className = 'bonus-message';
            bonusMessage.textContent = '+5 jetons pour avoir utilisé nos prédictions!';
            bonusMessage.style.textAlign = 'center';
            bonusMessage.style.marginTop = '20px';
            bonusMessage.style.color = '#4CAF50';
            bonusMessage.style.fontWeight = 'bold';
            gameContent.appendChild(bonusMessage);
            
            // Animate the bonus message
            setTimeout(() => {
                bonusMessage.classList.add('pulse');
            }, 500);
        }, 2000);
    }
    
    function createPredictionCards(matches) {
        matches.forEach(match => {
            const card = document.createElement('div');
            card.className = 'prediction-card';
            
            const header = document.createElement('div');
            header.className = 'prediction-header';
            
            const teams = document.createElement('div');
            teams.className = 'match-teams';
            teams.textContent = match.teams;
            
            const result = document.createElement('div');
            result.className = 'prediction-result';
            result.textContent = match.prediction;
            
            header.appendChild(teams);
            header.appendChild(result);
            
            const details = document.createElement('div');
            details.className = 'prediction-details';
            
            // Home odds
            const homeStat = document.createElement('div');
            homeStat.className = 'prediction-stat';
            
            const homeName = document.createElement('div');
            homeName.className = 'stat-name';
            homeName.textContent = 'Victoire 1';
            
            const homeValue = document.createElement('div');
            homeValue.className = 'stat-value-pred';
            homeValue.textContent = match.homeOdds;
            
            homeStat.appendChild(homeName);
            homeStat.appendChild(homeValue);
            
            // Draw odds
            const drawStat = document.createElement('div');
            drawStat.className = 'prediction-stat';
            
            const drawName = document.createElement('div');
            drawName.className = 'stat-name';
            drawName.textContent = 'Nul';
            
            const drawValue = document.createElement('div');
            drawValue.className = 'stat-value-pred';
            drawValue.textContent = match.drawOdds;
            
            drawStat.appendChild(drawName);
            drawStat.appendChild(drawValue);
            
            // Away odds
            const awayStat = document.createElement('div');
            awayStat.className = 'prediction-stat';
            
            const awayName = document.createElement('div');
            awayName.className = 'stat-name';
            awayName.textContent = 'Victoire 2';
            
            const awayValue = document.createElement('div');
            awayValue.className = 'stat-value-pred';
            awayValue.textContent = match.awayOdds;
            
            awayStat.appendChild(awayName);
            awayStat.appendChild(awayValue);
            
            details.appendChild(homeStat);
            details.appendChild(drawStat);
            details.appendChild(awayStat);
            
            // Confidence bar
            const confidenceContainer = document.createElement('div');
            confidenceContainer.className = 'prediction-confidence';
            
            const confidenceBar = document.createElement('div');
            confidenceBar.className = 'confidence-bar';
            confidenceBar.style.width = '0%';
            
            confidenceContainer.appendChild(confidenceBar);
            
            card.appendChild(header);
            card.appendChild(details);
            card.appendChild(confidenceContainer);
            
            gameContent.appendChild(card);
            
            // Animate the confidence bar
            setTimeout(() => {
                confidenceBar.style.width = `${match.confidence}%`;
            }, 300);
        });
    }
    
    function loadBaccaratGameContent(bookmaker) {
        gameContent.innerHTML = '';
        
        // Create loading animation
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-animation';
        loadingDiv.textContent = 'Chargement des prédictions Baccarat...';
        gameContent.appendChild(loadingDiv);
        
        // Simulate loading time
        setTimeout(() => {
            gameContent.innerHTML = '';
            
            // Create baccarat table
            const baccaratTable = document.createElement('div');
            baccaratTable.className = 'baccarat-table';
            
            // Table header
            const header = document.createElement('div');
            header.className = 'baccarat-header';
            header.innerHTML = `<h3>Prédictions Baccarat - ${bookmaker.toUpperCase()}</h3>`;
            
            // Predictions
            const predictions = document.createElement('div');
            predictions.className = 'baccarat-prediction';
            
            // Player box
            const playerBox = document.createElement('div');
            playerBox.className = 'prediction-box';
            playerBox.innerHTML = `
                <h4>Joueur</h4>
                <div class="prediction-percentage">38%</div>
            `;
            
            // Banker box
            const bankerBox = document.createElement('div');
            bankerBox.className = 'prediction-box highlighted';
            bankerBox.innerHTML = `
                <h4>Banquier</h4>
                <div class="prediction-percentage">51%</div>
            `;
            
            // Tie box
            const tieBox = document.createElement('div');
            tieBox.className = 'prediction-box';
            tieBox.innerHTML = `
                <h4>Égalité</h4>
                <div class="prediction-percentage">11%</div>
            `;
            
            predictions.appendChild(playerBox);
            predictions.appendChild(bankerBox);
            predictions.appendChild(tieBox);
            
            // Baccarat history
            const historyContainer = document.createElement('div');
            historyContainer.innerHTML = '<h4 style="text-align:center;margin-bottom:10px;">Historique des 20 derniers tirages</h4>';
            
            const history = document.createElement('div');
            history.className = 'baccarat-history';
            
            // Generate random history
            const outcomes = ['P', 'B', 'T'];
            const colors = ['history-player', 'history-banker', 'history-tie'];
            
            for (let i = 0; i < 20; i++) {
                const random = Math.random();
                let outcomeIndex;
                
                if (random < 0.45) {
                    outcomeIndex = 1; // Banker (45% chance)
                } else if (random < 0.85) {
                    outcomeIndex = 0; // Player (40% chance)
                } else {
                    outcomeIndex = 2; // Tie (15% chance)
                }
                
                const historyItem = document.createElement('div');
                historyItem.className = `history-item ${colors[outcomeIndex]}`;
                historyItem.textContent = outcomes[outcomeIndex];
                history.appendChild(historyItem);
            }
            
            historyContainer.appendChild(history);
            
            // Append all elements to the baccarat table
            baccaratTable.appendChild(header);
            baccaratTable.appendChild(predictions);
            baccaratTable.appendChild(historyContainer);
            
            gameContent.appendChild(baccaratTable);
            
            // Add recommendation
            const recommendation = document.createElement('div');
            recommendation.style.textAlign = 'center';
            recommendation.style.margin = '20px 0';
            recommendation.style.padding = '15px';
            recommendation.style.backgroundColor = 'rgba(255, 193, 7, 0.1)';
            recommendation.style.borderRadius = '10px';
            recommendation.innerHTML = `
                <h3 style="margin-bottom:10px;color:var(--secondary-color);">Recommandation</h3>
                <p style="margin-bottom:15px;">Notre système d'IA recommande de parier sur le <strong>Banquier</strong> pour le prochain tirage.</p>
                <p>Cote moyenne: <strong>0.95</strong></p>
            `;
            
            gameContent.appendChild(recommendation);
            
            // Add bonus for generating predictions
            userData.coins += 5;
            saveUserData();
            updateProfileUI();
            
            // Show bonus message
            const bonusMessage = document.createElement('div');
            bonusMessage.className = 'bonus-message';
            bonusMessage.textContent = '+5 jetons pour avoir utilisé nos prédictions!';
            bonusMessage.style.textAlign = 'center';
            bonusMessage.style.marginTop = '20px';
            bonusMessage.style.color = '#4CAF50';
            bonusMessage.style.fontWeight = 'bold';
            gameContent.appendChild(bonusMessage);
            // Animate the bonus message
            setTimeout(() => {
                bonusMessage.classList.add('pulse');
            }, 500);
        }, 2000);
    }
    
    function loadAppleOfFortuneContent(bookmaker) {
        premiumGameContent.innerHTML = '';
        
        // Create loading animation
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-animation';
        loadingDiv.textContent = 'Calcul de la prédiction en cours...';
        premiumGameContent.appendChild(loadingDiv);
        
        // Simulate loading time
        setTimeout(() => {
            premiumGameContent.innerHTML = '';
            
            // Create palier indicator
            updatePalierIndicator();
            
            // Create apples container
            const applesContainer = document.createElement('div');
            applesContainer.className = 'apples-container';
            
            // Create 5 apple cases
            for (let i = 1; i <= 5; i++) {
                const appleCase = document.createElement('div');
                appleCase.className = 'apple-case';
                appleCase.innerHTML = `
                    <div class="apple-icon">🍎</div>
                    <div class="case-number">${i}</div>
                `;
                applesContainer.appendChild(appleCase);
            }
            
            // Add scanner element
            const scanner = document.createElement('div');
            scanner.className = 'scanner';
            applesContainer.appendChild(scanner);
            
            premiumGameContent.appendChild(applesContainer);
            
            // Create result message (hidden initially)
            const resultMessage = document.createElement('div');
            resultMessage.className = 'result-message';
            resultMessage.textContent = 'Analyse terminée...';
            premiumGameContent.appendChild(resultMessage);
            
            // Start scanning animation
            applesContainer.classList.add('scanning');
            
            // After scanning, show the result
            setTimeout(() => {
                // Remove scanning class
                applesContainer.classList.remove('scanning');
                
                // Randomly select a winning apple
                const winningCase = Math.floor(Math.random() * 5) + 1;
                
                // Highlight the winning apple
                const appleCases = document.querySelectorAll('.apple-case');
                appleCases[winningCase - 1].classList.add('selected');
                
                // Update and show result message
                resultMessage.textContent = `Prédiction : Case ${winningCase}`;
                premiumGameContent.classList.add('result-visible');
                
                // Add bonus for generating predictions
                userData.coins += 10;
                saveUserData();
                updateProfileUI();
                
                // Show bonus message
                const bonusMessage = document.createElement('div');
                bonusMessage.className = 'bonus-message';
                bonusMessage.textContent = '+10 jetons pour avoir utilisé nos prédictions premium!';
                bonusMessage.style.textAlign = 'center';
                bonusMessage.style.marginTop = '20px';
                bonusMessage.style.color = '#4CAF50';
                bonusMessage.style.fontWeight = 'bold';
                premiumGameContent.appendChild(bonusMessage);
                
                // Animate the bonus message
                setTimeout(() => {
                    bonusMessage.classList.add('pulse');
                }, 500);
            }, 5000); // 5 seconds of scanning animation
        }, 2000);
    }
    
    function loadGodModeContent() {
        premiumGameContent.innerHTML = '';
        
        // Create loading animation
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-animation';
        loadingDiv.textContent = 'Chargement des prédictions avancées...';
        premiumGameContent.appendChild(loadingDiv);
        
        // Simulate loading time
        setTimeout(() => {
            premiumGameContent.innerHTML = '';
            
            // Create palier indicator
            updatePalierIndicator();
            
            // Add match predictions - with higher confidence values
            const matches = [
                {
                    teams: 'Liverpool vs Manchester City',
                    prediction: 'Liverpool Win',
                    homeOdds: '2.40',
                    drawOdds: '3.60',
                    awayOdds: '2.70',
                    confidence: 92
                },
                {
                    teams: 'Real Madrid vs Atletico Madrid',
                    prediction: 'Real Madrid Win',
                    homeOdds: '1.95',
                    drawOdds: '3.30',
                    awayOdds: '3.80',
                    confidence: 88
                },
                {
                    teams: 'Bayern Munich vs RB Leipzig',
                    prediction: 'Bayern Munich Win',
                    homeOdds: '1.65',
                    drawOdds: '4.00',
                    awayOdds: '4.50',
                    confidence: 95
                }
            ];
            
            // Create premium prediction cards
            matches.forEach(match => {
                const card = document.createElement('div');
                card.className = 'prediction-card';
                
                const header = document.createElement('div');
                header.className = 'prediction-header';
                
                const teams = document.createElement('div');
                teams.className = 'match-teams';
                teams.textContent = match.teams;
                
                const result = document.createElement('div');
                result.className = 'prediction-result';
                result.textContent = match.prediction;
                
                header.appendChild(teams);
                header.appendChild(result);
                
                const details = document.createElement('div');
                details.className = 'prediction-details';
                
                // Home odds
                const homeStat = document.createElement('div');
                homeStat.className = 'prediction-stat';
                
                const homeName = document.createElement('div');
                homeName.className = 'stat-name';
                homeName.textContent = 'Victoire 1';
                
                const homeValue = document.createElement('div');
                homeValue.className = 'stat-value-pred';
                homeValue.textContent = match.homeOdds;
                
                homeStat.appendChild(homeName);
                homeStat.appendChild(homeValue);
                
                // Draw odds
                const drawStat = document.createElement('div');
                drawStat.className = 'prediction-stat';
                
                const drawName = document.createElement('div');
                drawName.className = 'stat-name';
                drawName.textContent = 'Nul';
                
                const drawValue = document.createElement('div');
                drawValue.className = 'stat-value-pred';
                drawValue.textContent = match.drawOdds;
                
                drawStat.appendChild(drawName);
                drawStat.appendChild(drawValue);
                
                // Away odds
                const awayStat = document.createElement('div');
                awayStat.className = 'prediction-stat';
                
                const awayName = document.createElement('div');
                awayName.className = 'stat-name';
                awayName.textContent = 'Victoire 2';
                
                const awayValue = document.createElement('div');
                awayValue.className = 'stat-value-pred';
                awayValue.textContent = match.awayOdds;
                
                awayStat.appendChild(awayName);
                awayStat.appendChild(awayValue);
                
                details.appendChild(homeStat);
                details.appendChild(drawStat);
                details.appendChild(awayStat);
                
                // Confidence bar
                const confidenceContainer = document.createElement('div');
                confidenceContainer.className = 'prediction-confidence';
                
                const confidenceBar = document.createElement('div');
                confidenceBar.className = 'confidence-bar';
                confidenceBar.style.width = '0%';
                
                confidenceContainer.appendChild(confidenceBar);
                
                card.appendChild(header);
                card.appendChild(details);
                card.appendChild(confidenceContainer);
                
                premiumGameContent.appendChild(card);
                
                // Animate the confidence bar
                setTimeout(() => {
                    confidenceBar.style.width = `${match.confidence}%`;
                }, 300);
            });
            
            // Add premium feature notice
            const premiumNotice = document.createElement('div');
            premiumNotice.style.textAlign = 'center';
            premiumNotice.style.margin = '20px 0';
            premiumNotice.style.padding = '15px';
            premiumNotice.style.backgroundColor = 'rgba(156, 39, 176, 0.1)';
            premiumNotice.style.borderRadius = '10px';
            premiumNotice.innerHTML = `
                <h3 style="margin-bottom:10px;color:var(--premium-purple);">Mode Premium Activé</h3>
                <p style="margin-bottom:15px;">Nos algorithmes avancés vous fournissent les prédictions avec la plus haute fiabilité du marché.</p>
                <p>Confiance moyenne: <strong>92%</strong></p>
            `;
            
            premiumGameContent.appendChild(premiumNotice);
            
            // Add bonus for generating predictions
            userData.coins += 15;
            saveUserData();
            updateProfileUI();
            
            // Show bonus message
            const bonusMessage = document.createElement('div');
            bonusMessage.className = 'bonus-message';
            bonusMessage.textContent = '+15 jetons pour avoir utilisé le mode God!';
            bonusMessage.style.textAlign = 'center';
            bonusMessage.style.marginTop = '20px';
            bonusMessage.style.color = '#4CAF50';
            bonusMessage.style.fontWeight = 'bold';
            premiumGameContent.appendChild(bonusMessage);
            
            // Animate the bonus message
            setTimeout(() => {
                bonusMessage.classList.add('pulse');
            }, 500);
        }, 2000);
    }
    
    function loadSegaFootballContent() {
        premiumGameContent.innerHTML = '';
        
        // Create loading animation
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-animation';
        loadingDiv.textContent = 'Chargement des prédictions Sega Football...';
        premiumGameContent.appendChild(loadingDiv);
        
        // Simulate loading time
        setTimeout(() => {
            premiumGameContent.innerHTML = '';
            
            // Create palier indicator
            updatePalierIndicator();
            
            // Add sega football predictions - low scores focused
            const matches = [
                {
                    teams: 'Virtual Team A vs Virtual Team B',
                    prediction: 'Score: 1-0',
                    first: 'Under 2.5',
                    second: 'BTTS: No',
                    third: 'HT: 0-0',
                    confidence: 85
                },
                {
                    teams: 'Virtual Team C vs Virtual Team D',
                    prediction: 'Score: 2-0',
                    first: 'Under 2.5',
                    second: 'BTTS: No',
                    third: 'HT: 1-0',
                    confidence: 82
                },
                {
                    teams: 'Virtual Team E vs Virtual Team F',
                    prediction: 'Score: 0-1',
                    first: 'Under 2.5',
                    second: 'BTTS: No',
                    third: 'HT: 0-0',
                    confidence: 88
                }
            ];
            
            // Create prediction cards tailored for Sega Football
            matches.forEach(match => {
                const card = document.createElement('div');
                card.className = 'prediction-card';
                
                const header = document.createElement('div');
                header.className = 'prediction-header';
                
                const teams = document.createElement('div');
                teams.className = 'match-teams';
                teams.textContent = match.teams;
                
                const result = document.createElement('div');
                result.className = 'prediction-result';
                result.textContent = match.prediction;
                
                header.appendChild(teams);
                header.appendChild(result);
                
                const details = document.createElement('div');
                details.className = 'prediction-details';
                
                // First stat
                const firstStat = document.createElement('div');
                firstStat.className = 'prediction-stat';
                
                const firstName = document.createElement('div');
                firstName.className = 'stat-name';
                firstName.textContent = 'Goals';
                
                const firstValue = document.createElement('div');
                firstValue.className = 'stat-value-pred';
                firstValue.textContent = match.first;
                
                firstStat.appendChild(firstName);
                firstStat.appendChild(firstValue);
                
                // Second stat
                const secondStat = document.createElement('div');
                secondStat.className = 'prediction-stat';
                
                const secondName = document.createElement('div');
                secondName.className = 'stat-name';
                secondName.textContent = 'Both Teams';
                
                const secondValue = document.createElement('div');
                secondValue.className = 'stat-value-pred';
                secondValue.textContent = match.second;
                
                secondStat.appendChild(secondName);
                secondStat.appendChild(secondValue);
                
                // Third stat
                const thirdStat = document.createElement('div');
                thirdStat.className = 'prediction-stat';
                
                const thirdName = document.createElement('div');
                thirdName.className = 'stat-name';
                thirdName.textContent = 'Half-Time';
                
                const thirdValue = document.createElement('div');
                thirdValue.className = 'stat-value-pred';
                thirdValue.textContent = match.third;
                
                thirdStat.appendChild(thirdName);
                thirdStat.appendChild(thirdValue);
                
                details.appendChild(firstStat);
                details.appendChild(secondStat);
                details.appendChild(thirdStat);
                
                // Confidence bar
                const confidenceContainer = document.createElement('div');
                confidenceContainer.className = 'prediction-confidence';
                
                const confidenceBar = document.createElement('div');
                confidenceBar.className = 'confidence-bar';
                confidenceBar.style.width = '0%';
                
                confidenceContainer.appendChild(confidenceBar);
                
                card.appendChild(header);
                card.appendChild(details);
                card.appendChild(confidenceContainer);
                
                premiumGameContent.appendChild(card);
                
                // Animate the confidence bar
                setTimeout(() => {
                    confidenceBar.style.width = `${match.confidence}%`;
                }, 300);
            });
            
            // Add Sega Football specific notice
            const segaNotice = document.createElement('div');
            segaNotice.style.textAlign = 'center';
            segaNotice.style.margin = '20px 0';
            segaNotice.style.padding = '15px';
            segaNotice.style.backgroundColor = 'rgba(156, 39, 176, 0.1)';
            segaNotice.style.borderRadius = '10px';
            segaNotice.innerHTML = `
                <h3 style="margin-bottom:10px;color:var(--premium-purple);">Prédictions Sega Football</h3>
                <p style="margin-bottom:15px;">Nos prédictions sont spécialement optimisées pour les matchs à faible nombre de buts.</p>
                <p>Stratégie recommandée: <strong>Under 2.5 Goals + BTTS No</strong></p>
            `;
            
            premiumGameContent.appendChild(segaNotice);
            
            // Add bonus for generating predictions
            userData.coins += 12;
            saveUserData();
            updateProfileUI();
            
            // Show bonus message
            const bonusMessage = document.createElement('div');
            bonusMessage.className = 'bonus-message';
            bonusMessage.textContent = '+12 jetons pour avoir utilisé Sega Football!';
            bonusMessage.style.textAlign = 'center';
            bonusMessage.style.marginTop = '20px';
            bonusMessage.style.color = '#4CAF50';
            bonusMessage.style.fontWeight = 'bold';
            premiumGameContent.appendChild(bonusMessage);
            
            // Animate the bonus message
            setTimeout(() => {
                bonusMessage.classList.add('pulse');
            }, 500);
        }, 2000);
    }
    
    // 3D Effects using Three.js
    function initThreeJS() {
        // Add hover effect to buttons for 3D feel - but keep it disabled for now, static as requested
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseover', function() {
                if (!this.classList.contains('disabled')) {
                    this.style.transform = 'translateY(-3px)';
                    this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                }
            });
            
            button.addEventListener('mouseout', function() {
                if (!this.classList.contains('disabled')) {
                    this.style.transform = '';
                    this.style.boxShadow = '';
                }
            });
            
            button.addEventListener('mousedown', function() {
                if (!this.classList.contains('disabled')) {
                    this.style.transform = 'translateY(1px)';
                    this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
            });
            
            button.addEventListener('mouseup', function() {
                if (!this.classList.contains('disabled')) {
                    this.style.transform = 'translateY(-3px)';
                    this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                }
            });
        });
    }
    
    // Add shake animation for invalid input
    usernameInput.addEventListener('animationend', function() {
        this.classList.remove('shake');
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
                transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
                transform: translateX(5px);
            }
        }
        .shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize with the default section (Jeu)
    document.querySelector('.nav-button[data-section="jeu"]').classList.add('active');
    document.getElementById('jeu-section').classList.add('active');
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Number keys 1-4 for navigation
        if (e.key >= '1' && e.key <= '4') {
            const index = parseInt(e.key) - 1;
            if (index >= 0 && index < navButtons.length) {
                navButtons[index].click();
            }
        }
        
        // Escape key to go back
        if (e.key === 'Escape') {
            if (gameInterface.classList.contains('active')) {
                backToGamesButton.click();
            } else if (premiumGameInterface.classList.contains('active')) {
                premiumHomeButton.click();
            } else {
                const activeSubGame = document.querySelector('.sub-games-container.active');
                if (activeSubGame) {
                    activeSubGame.querySelector('.back-button').click();
                }
            }
        }
    });
    
    // Add swipe gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const sections = ['jeu', 'vip', 'services', 'profil'];
        let currentIndex = sections.findIndex(section => 
            document.getElementById(`${section}-section`).classList.contains('active')
        );
        
        if (touchEndX < touchStartX - 50) {
            // Swipe left - go to next section
            currentIndex = (currentIndex + 1) % sections.length;
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right - go to previous section
            currentIndex = (currentIndex - 1 + sections.length) % sections.length;
        } else {
            return; // Not a significant swipe
        }
        
        // Activate the new section
        document.querySelector(`.nav-button[data-section="${sections[currentIndex]}"]`).click();
    }
    
    // Initialize responsive adjustments
    function adjustForScreenSize() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Adjust for mobile screens
            document.querySelectorAll('.nav-button .button-content').forEach(btn => {
                btn.style.width = '90%';
            });
        } else {
            // Adjust for larger screens
            document.querySelectorAll('.nav-button .button-content').forEach(btn => {
                btn.style.width = '80%';
            });
        }
    }
    
    // Call on load and on resize
    adjustForScreenSize();
    window.addEventListener('resize', adjustForScreenSize);
});
