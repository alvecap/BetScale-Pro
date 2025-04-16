// js/premium-games.js
// Logique des jeux premium

import { addCoins, isPremium } from './user.js';

// DOM Elements
let premiumButtons;
let appleSettings;
let godmodeSettings;
let segaSettings;
let startApplePrediction;
let startGodmodePrediction;
let startSegaPrediction;
let premiumGameInterface;
let premiumGameTitle;
let premiumGameContent;
let premiumNextButton;
let premiumNewPredictionButton;
let premiumHomeButton;

// Game state
let currentPalier = 0;

export function initPremiumGames() {
    // Initialize DOM elements
    premiumButtons = document.querySelectorAll('.premium-button[data-game]');
    appleSettings = document.getElementById('apple-settings');
    godmodeSettings = document.getElementById('godmode-settings');
    segaSettings = document.getElementById('sega-settings');
    startApplePrediction = document.getElementById('start-apple-prediction');
    startGodmodePrediction = document.getElementById('start-godmode-prediction');
    startSegaPrediction = document.getElementById('start-sega-prediction');
    premiumGameInterface = document.getElementById('premium-game-interface');
    premiumGameTitle = document.getElementById('premium-game-title');
    premiumGameContent = document.getElementById('premium-game-content');
    premiumNextButton = document.getElementById('premium-next-button');
    premiumNewPredictionButton = document.getElementById('premium-new-prediction-button');
    premiumHomeButton = document.getElementById('premium-home-button');
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Premium games: Commencer button click events
    premiumButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Check if user is premium
            if (!isPremium()) {
                alert('Cette fonctionnalité est réservée aux utilisateurs Premium. Passez Premium pour y accéder!');
                return;
            }
            
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
    
    // Apple of Fortune Start Prediction button
    if (startApplePrediction) {
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
            currentPalier = 0;
            loadAppleOfFortuneContent(selectedBookmaker.value);
        });
    }
    
    // God Mode Start Prediction button
    if (startGodmodePrediction) {
        startGodmodePrediction.addEventListener('click', function() {
            // Hide settings
            godmodeSettings.classList.remove('active');
            
            // Show premium game interface
            premiumGameInterface.classList.add('active');
            
            // Set game title and load content
            premiumGameTitle.textContent = 'God Mode - Prédiction';
            currentPalier = 0;
            loadGodModeContent();
        });
    }
    
    // Sega Football Start Prediction button
    if (startSegaPrediction) {
        startSegaPrediction.addEventListener('click', function() {
            // Hide settings
            segaSettings.classList.remove('active');
            
            // Show premium game interface
            premiumGameInterface.classList.add('active');
            
            // Set game title and load content
            premiumGameTitle.textContent = 'Sega Football - Prédiction';
            currentPalier = 0;
            loadSegaFootballContent();
        });
    }
    
    // Premium Next button
    if (premiumNextButton) {
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
    }
    
    // Premium New Prediction button
    if (premiumNewPredictionButton) {
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
    }
    
    // Premium Home button
    if (premiumHomeButton) {
        premiumHomeButton.addEventListener('click', function() {
            resetPremiumGameView();
        });
    }
}

export function resetPremiumGameView() {
    // Hide premium game interface and settings screens
    if (premiumGameInterface) premiumGameInterface.classList.remove('active');
    if (appleSettings) appleSettings.classList.remove('active');
    if (godmodeSettings) godmodeSettings.classList.remove('active');
    if (segaSettings) segaSettings.classList.remove('active');
    
    // Show premium game cards
    const vipGamesGrid = document.querySelector('.vip-games');
    if (vipGamesGrid) vipGamesGrid.style.display = 'grid';
    
    // Clear premium game content
    if (premiumGameContent) premiumGameContent.innerHTML = '';
    
    // Reset palier counter
    currentPalier = 0;
    
    // Re-enable next button if disabled
    if (premiumNextButton) {
        premiumNextButton.disabled = false;
        premiumNextButton.style.opacity = '1';
    }
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
            addCoins(10);
            
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
        addCoins(15);
        
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
        addCoins(12);
        
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
