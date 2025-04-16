// script.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');
    const loginModal = document.getElementById('login-modal');
    const usernameInput = document.getElementById('username-input');
    const loginButton = document.getElementById('login-button');
    const profileName = document.getElementById('profile-name');
    const profileStatus = document.getElementById('profile-status');
    const upgradeButton = document.querySelector('.upgrade-button');
    const vipButton = document.querySelector('.vip-button');
    const coinsElement = document.getElementById('coins');
    const winsElement = document.getElementById('wins');
    
    const discoverButtons = document.querySelectorAll('.discover-button');
    const subGamesContainers = document.querySelectorAll('.sub-games-container');
    const backButtons = document.querySelectorAll('.back-button');
    const startGameButtons = document.querySelectorAll('.start-game-button');
    const selectBookmakerButtons = document.querySelectorAll('.select-bookmaker-button');
    const createAccountButton = document.querySelector('.create-account-button');
    const bookmakerModal = document.getElementById('bookmaker-modal');
    const closeBookmakerModal = document.getElementById('close-bookmaker-modal');
    const gameInterface = document.getElementById('game-interface');
    const gameTitle = document.getElementById('game-title');
    const gameContent = document.getElementById('game-content');
    const backToGamesButton = document.querySelector('.back-to-games-button');
    
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
    
    // Discover button click events (FIFA and Baccarat)
    discoverButtons.forEach(button => {
        button.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            
            // Hide game cards
            document.querySelector('.games-grid').style.display = 'none';
            
            // Show appropriate sub-games
            if (game === 'fifa') {
                document.getElementById('fifa-games').classList.add('active');
                document.getElementById('fifa-games').style.animation = 'slideInRight 0.3s ease-in-out';
            } else if (game === 'baccarat') {
                document.getElementById('baccarat-bookmakers').classList.add('active');
                document.getElementById('baccarat-bookmakers').style.animation = 'slideInRight 0.3s ease-in-out';
            }
        });
    });
    
    // Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide all sub-games containers
            subGamesContainers.forEach(container => container.classList.remove('active'));
            
            // Show game cards
            document.querySelector('.games-grid').style.display = 'grid';
        });
    });
    
    // Start game buttons (FIFA games)
    startGameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            
            // Hide sub-games
            subGamesContainers.forEach(container => container.classList.remove('active'));
            
            // Show game interface
            gameInterface.classList.add('active');
            
            // Set game title and load content
            if (gameType === 'fifa-england') {
                gameTitle.textContent = 'FC24 4x4 - Angleterre';
                loadFIFAGameContent('england');
            } else if (gameType === 'fifa-master') {
                gameTitle.textContent = 'FC24 3x3 - Master League';
                loadFIFAGameContent('master');
            }
        });
    });
    
    // Select bookmaker buttons
    selectBookmakerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookmaker = this.getAttribute('data-bookmaker');
            
            // Hide bookmakers
            document.getElementById('baccarat-bookmakers').classList.remove('active');
            
            // Show game interface
            gameInterface.classList.add('active');
            
            // Set game title and load content
            gameTitle.textContent = 'Baccarat - Prédictions';
            loadBaccaratGameContent(bookmaker);
        });
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
            
            // Switch to profile section to show changes
            navButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-section="profil"]').classList.add('active');
            
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById('profil-section').classList.add('active');
        }
    }
    
    function resetGameView() {
        // Hide game interface and sub-games
        gameInterface.classList.remove('active');
        subGamesContainers.forEach(container => container.classList.remove('active'));
        
        // Show game cards
        document.querySelector('.games-grid').style.display = 'grid';
        
        // Clear game content
        gameContent.innerHTML = '';
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
    
    // 3D Effects using Three.js
    function initThreeJS() {
        // This is a simplified version that adds subtle 3D effects to the UI
        // In a complete implementation, you'd want to create more complex 3D elements
        
        // Add hover effect to buttons for 3D feel
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-3px) scale(1.03)';
                this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            });
            
            button.addEventListener('mouseout', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
            
            button.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(1px) scale(0.98)';
                this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
            
            button.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-3px) scale(1.03)';
                this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            });
        });
        
        // Add parallax effect to VIP card
        const vipCard = document.querySelector('.vip-card');
        if (vipCard) {
            vipCard.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                this.style.transform = `perspective(1000px) rotateX(${-deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
                
                // Move highlight effect
                this.style.setProperty('--x', `${x}px`);
                this.style.setProperty('--y', `${y}px`);
            });
            
            vipCard.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        }
        
        // Add 3D effect to game cards
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / 20;
                const deltaY = (y - centerY) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
    
    // Add shake animation for invalid input
    usernameInput.addEventListener('animationend', function() {
        this.classList.remove('shake');
    });
    
    // Add CSS for shake animation
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
        
        .loading-animation {
            text-align: center;
            padding: 40px 0;
            color: var(--primary-color);
            font-size: 1.2rem;
            font-weight: 500;
            position: relative;
        }
        
        .loading-animation::after {
            content: '...';
            position: absolute;
            animation: dots 1.5s infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
    `;
    document.head.appendChild(style);
    
    // Add 3D tilt effect to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / 30;
            const deltaY = (y - centerY) / 30;
            
            this.style.transform = `perspective(1000px) rotateX(${-deltaY}deg) rotateY(${deltaX}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
    
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
            } else {
                const activeSubGame = document.querySelector('.sub-games-container.active');
                if (activeSubGame) {
                    activeSubGame.querySelector('.back-button').click();
                }
            }
        }
    });
    
    // Preload animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
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
    
    // Add dynamic loading effect for content sections
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            const targetSection = document.getElementById(`${section}-section`);
            
            // Reset animation
            targetSection.style.animation = 'none';
            targetSection.offsetHeight; // Trigger reflow
            targetSection.style.animation = 'fadeIn 0.3s ease-in-out';
        });
    });
    
    // Easter egg - Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        // Check if the key matches the expected key in the sequence
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            // If the entire sequence is matched
            if (konamiIndex === konamiCode.length) {
                // Activate easter egg - bonus coins
                userData.coins += 1000;
                saveUserData();
                updateProfileUI();
                
                // Show a fun animation
                const easterEggDiv = document.createElement('div');
                easterEggDiv.style.position = 'fixed';
                easterEggDiv.style.top = '0';
                easterEggDiv.style.left = '0';
                easterEggDiv.style.width = '100%';
                easterEggDiv.style.height = '100%';
                easterEggDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
                easterEggDiv.style.color = 'gold';
                easterEggDiv.style.fontSize = '3rem';
                easterEggDiv.style.display = 'flex';
                easterEggDiv.style.justifyContent = 'center';
                easterEggDiv.style.alignItems = 'center';
                easterEggDiv.style.zIndex = '9999';
                easterEggDiv.textContent = '🎮 CODE SECRET ACTIVÉ! +1000 JETONS! 🎮';
                document.body.appendChild(easterEggDiv);
                
                setTimeout(() => {
                    document.body.removeChild(easterEggDiv);
                }, 3000);
                
                // Reset the counter
                konamiIndex = 0;
            }
        } else {
            // Reset if wrong key
            konamiIndex = 0;
        }
    });
});
