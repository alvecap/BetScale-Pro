// js/free-games.js
// Logique des jeux gratuits

import { addCoins, addWin } from './user.js';

// DOM Elements
let discoverButton;
let startButton;
let gamesGrid;
let fifaGames;
let baccaratBookmakers;
let backButtons;
let selectGameButtons;
let nextButton;
let selectBookmakerButtons;
let createAccountButton;
let bookmakerModal;
let closeBookmakerModal;
let gameInterface;
let gameTitle;
let gameContent;
let backToGamesButton;

// Game state
let selectedFifaGame = null;

export function initFreeGames() {
    // Initialize DOM elements
    discoverButton = document.querySelector('.discover-button');
    startButton = document.querySelector('.start-button');
    gamesGrid = document.querySelector('.games-grid');
    fifaGames = document.getElementById('fifa-games');
    baccaratBookmakers = document.getElementById('baccarat-bookmakers');
    backButtons = document.querySelectorAll('.back-button');
    selectGameButtons = document.querySelectorAll('.select-game-button');
    nextButton = document.getElementById('fifa-next-button');
    selectBookmakerButtons = document.querySelectorAll('.select-bookmaker-button');
    createAccountButton = document.querySelector('.create-account-button');
    bookmakerModal = document.getElementById('bookmaker-modal');
    closeBookmakerModal = document.getElementById('close-bookmaker-modal');
    gameInterface = document.getElementById('game-interface');
    gameTitle = document.getElementById('game-title');
    gameContent = document.getElementById('game-content');
    backToGamesButton = document.querySelector('.back-to-games-button');
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // FIFA: Découvrir button click event
    if (discoverButton) {
        discoverButton.addEventListener('click', function() {
            gamesGrid.style.display = 'none';
            fifaGames.classList.add('active');
            fifaGames.style.animation = 'fadeIn 0.3s ease-in-out';
        });
    }
    
    // Baccarat: Commencer button click event
    if (startButton) {
        startButton.addEventListener('click', function() {
            gamesGrid.style.display = 'none';
            baccaratBookmakers.classList.add('active');
            baccaratBookmakers.style.animation = 'fadeIn 0.3s ease-in-out';
        });
    }
    
    // Back buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const container = this.closest('.sub-games-container');
            if (container) {
                container.classList.remove('active');
                
                // Check if we're in the free games section
                if (container.id === 'fifa-games' || container.id === 'baccarat-bookmakers') {
                    // Free games section
                    gamesGrid.style.display = 'grid';
                    
                    // Reset selected FIFA game
                    resetFifaSelection();
                }
            }
        });
    });
    
    // Selection of FIFA game
    selectGameButtons.forEach(button => {
        button.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            
            // Reset previous selection
            resetFifaSelection();
            
            // Set new selection
            this.parentElement.classList.add('selected');
            this.textContent = 'Sélectionné ✓';
            selectedFifaGame = game;
            
            // Enable next button
            nextButton.classList.remove('disabled');
        });
    });
    
    // FIFA Next button
    if (nextButton) {
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
    }
    
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
    
    // Create account button
    if (createAccountButton) {
        createAccountButton.addEventListener('click', function() {
            showBookmakerModal();
        });
    }
    
    // Close bookmaker modal
    if (closeBookmakerModal) {
        closeBookmakerModal.addEventListener('click', function() {
            hideBookmakerModal();
        });
    }
    
    // Back to games button
    if (backToGamesButton) {
        backToGamesButton.addEventListener('click', function() {
            resetGameView();
        });
    }
}

function resetFifaSelection() {
    selectedFifaGame = null;
    selectGameButtons.forEach(btn => {
        btn.parentElement.classList.remove('selected');
        btn.textContent = 'Sélectionner';
    });
    if (nextButton) {
        nextButton.classList.add('disabled');
    }
}

export function resetGameView() {
    // Hide game interface and sub-games
    if (gameInterface) gameInterface.classList.remove('active');
    if (fifaGames) fifaGames.classList.remove('active');
    if (baccaratBookmakers) baccaratBookmakers.classList.remove('active');
    
    // Show game cards
    if (gamesGrid) gamesGrid.style.display = 'grid';
    
    // Clear game content
    if (gameContent) gameContent.innerHTML = '';
    
    // Reset selected game
    resetFifaSelection();
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
        addCoins(5);
        
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
        addCoins(5);
        
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

function showBookmakerModal() {
    bookmakerModal.classList.add('active');
}

function hideBookmakerModal() {
    bookmakerModal.classList.remove('active');
}
