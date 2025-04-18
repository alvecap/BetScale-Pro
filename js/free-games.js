// js/free-games.js
// Logique des jeux gratuits

import { addCoins, addWin } from './user.js';
import { initFifaPredictionSystem } from './fifa-prediction-system.js';

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
                    // Lancer directement le système de prédiction avancé
                    initFifaPredictionSystem(gameContent, 'england');
                } else if (selectedFifaGame === 'fifa-master') {
                    gameTitle.textContent = 'FC24 3x3 - Master League';
                    // Lancer directement le système de prédiction avancé
                    initFifaPredictionSystem(gameContent, 'master');
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

function loadBaccaratGameContent(bookmaker) {
    gameContent.innerHTML = '';
    
    // Create loading animation
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation';
    loadingDiv.textContent = 'Analyse des données Baccarat...';
    gameContent.appendChild(loadingDiv);
    
    // Simulate loading time - montrer l'animation 3D
    setTimeout(() => {
        gameContent.innerHTML = '';
        
        // Animation 3D
        const animationHTML = `
            <div class="prediction-animation">
                <div class="animation-title">Génération de la prédiction...</div>
                <div class="animation-model">
                    <div class="model-sphere">
                        <div class="model-ring ring1"></div>
                        <div class="model-ring ring2"></div>
                        <div class="model-ring ring3"></div>
                        <div class="model-core"></div>
                    </div>
                    <div class="model-stats">
                        <div class="stat-bar"><div class="stat-progress"></div></div>
                        <div class="stat-bar"><div class="stat-progress"></div></div>
                        <div class="stat-bar"><div class="stat-progress"></div></div>
                    </div>
                </div>
                <div class="animation-status">Analyse des cartes en cours...</div>
            </div>
        `;
        
        gameContent.innerHTML = animationHTML;
        
        // Add status update animation
        const statusElement = gameContent.querySelector('.animation-status');
        const statuses = [
            "Analyse des cartes en cours...",
            "Calcul des probabilités...",
            "Application du modèle mathématique...",
            "Finalisation de la prédiction..."
        ];
        
        let statusIndex = 0;
        const statusInterval = setInterval(() => {
            statusIndex = (statusIndex + 1) % statuses.length;
            statusElement.textContent = statuses[statusIndex];
        }, 1000);
        
        // Animate stat bars
        const statBars = gameContent.querySelectorAll('.stat-progress');
        statBars.forEach(bar => {
            const finalWidth = Math.random() * 60 + 40; // 40% to 100%
            
            // Set initial width
            bar.style.width = '0%';
            
            // Animate to final width
            setTimeout(() => {
                bar.style.transition = 'width 3s ease-in-out';
                bar.style.width = `${finalWidth}%`;
            }, 500);
        });
        
        // Après l'animation, afficher les résultats
        setTimeout(() => {
            clearInterval(statusInterval);
            
            // Générer un résultat aléatoire pour Baccarat
            // Gagnant: Joueur ou Banquier (65% en faveur du banquier)
            const isPlayerWinner = Math.random() > 0.65;
            const winner = isPlayerWinner ? 'Joueur' : 'Banquier';
            
            // Nombre de points entre 7.5 et 12.5
            const totalPoints = (Math.random() * 5 + 7.5).toFixed(1);
            // Convertir au format x.5 pour les paris sportifs
            const formattedPoints = Math.floor(parseFloat(totalPoints)) + 0.5;
            
            // Confiance entre 70% et 90%
            const confidence = Math.floor(Math.random() * 21) + 70;
            
            // Afficher les résultats
            gameContent.innerHTML = '';
            
            const resultsHTML = `
                <div class="baccarat-results">
                    <h3>Prédiction Baccarat - ${bookmaker.toUpperCase()}</h3>
                    
                    <div class="results-grid">
                        <div class="result-card winner">
                            <h4>Gagnant Probable</h4>
                            <div class="winner-display">
                                <span class="winner-name">${winner}</span>
                            </div>
                            <div class="confidence-meter">
                                <div class="confidence-label">Confiance: ${confidence}%</div>
                                <div class="confidence-bar">
                                    <div class="confidence-fill" style="width: ${confidence}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="result-card total-goals high-confidence">
                            <h4>Nombre Total de Points</h4>
                            <div class="total-display">
                                <span class="total-value">${formattedPoints}</span>
                            </div>
                            <div class="confidence-meter">
                                <div class="confidence-label">Confiance: ${confidence + 5}%</div>
                                <div class="confidence-bar">
                                    <div class="confidence-fill" style="width: ${confidence + 5}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="results-note">
                        <p>Le résultat est basé sur l'analyse des tendances récentes et notre modèle prédictif.</p>
                        <p>Le nombre total de points est notre prédiction avec la plus grande fiabilité.</p>
                    </div>
                </div>
            `;
            
            gameContent.innerHTML = resultsHTML;
            
            // Add result buttons
            const resultButtons = document.createElement('div');
            resultButtons.className = 'result-buttons';
            
            const newPredictionButton = document.createElement('button');
            newPredictionButton.className = 'nav-button';
            newPredictionButton.textContent = 'Nouvelle prédiction';
            newPredictionButton.addEventListener('click', function() {
                loadBaccaratGameContent(bookmaker);
            });
            
            const homeButton = document.createElement('button');
            homeButton.className = 'nav-button';
            homeButton.textContent = 'Accueil';
            homeButton.addEventListener('click', resetGameView);
            
            resultButtons.appendChild(newPredictionButton);
            resultButtons.appendChild(homeButton);
            gameContent.appendChild(resultButtons);
            
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
        }, 5000); // Fin de l'animation après 5 secondes
    }, 1000); // Temps initial de chargement
}

function showBookmakerModal() {
    bookmakerModal.classList.add('active');
}

function hideBookmakerModal() {
    bookmakerModal.classList.remove('active');
}
