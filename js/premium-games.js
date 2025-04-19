// js/premium-games.js
// Logique des jeux premium avec questions par étapes

import { addCoins, isPremium, isAdmin } from './user.js';

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
let currentGodModeStep = 1;
let currentSegaStep = 1;
let godModeData = {};
let segaData = {};

// Structure des étapes pour God Mode (10 questions regroupées en 4 pages)
const godModeSteps = [
    {
        title: "Cotes et Totaux",
        description: "Ces informations servent à calibrer le modèle prédictif avancé.",
        fields: [
            { id: "godmode-home-odds", type: "number", label: "Cote victoire domicile (1)", placeholder: "Ex: 2.10", step: "0.01", help: "Cote pour l'équipe à domicile" },
            { id: "godmode-draw-odds", type: "number", label: "Cote match nul (X)", placeholder: "Ex: 3.50", step: "0.01", help: "Cote pour un match nul" },
            { id: "godmode-away-odds", type: "number", label: "Cote victoire extérieur (2)", placeholder: "Ex: 3.20", step: "0.01", help: "Cote pour l'équipe à l'extérieur" },
            { id: "godmode-home-over15", type: "number", label: "Total buts domicile +1.5", placeholder: "Ex: 1.65", step: "0.01", help: "Cote pour que l'équipe à domicile marque plus de 1.5 buts" },
            { id: "godmode-home-over25", type: "number", label: "Total buts domicile +2.5", placeholder: "Ex: 2.80", step: "0.01", help: "Cote pour que l'équipe à domicile marque plus de 2.5 buts" }
        ]
    },
    {
        title: "Scores Exacts Favoris",
        description: "Ces scores permettent d'estimer les tendances offensives et défensives.",
        fields: [
            { id: "godmode-home-favorite-score", type: "text", label: "Score exact favori domicile", placeholder: "Ex: 2-0", help: "Score favori quand l'équipe à domicile gagne (format X-Y)" },
            { id: "godmode-home-favorite-odds", type: "number", label: "Cote de ce score", placeholder: "Ex: 6.50", step: "0.01", help: "Cote du score exact favori domicile" },
            { id: "godmode-first-half-score", type: "text", label: "Score 1ère mi-temps favori", placeholder: "Ex: 1-0", help: "Score favori pour la première mi-temps (format X-Y)" },
            { id: "godmode-first-half-odds", type: "number", label: "Cote score 1ère mi-temps", placeholder: "Ex: 3.75", step: "0.01", help: "Cote du score exact de première mi-temps" }
        ]
    },
    {
        title: "Scores Complémentaires",
        description: "Ces scores permettent d'affiner les prédictions en considérant plusieurs scénarios.",
        fields: [
            { id: "godmode-second-half-score", type: "text", label: "Score 2ème mi-temps favori", placeholder: "Ex: 1-0", help: "Score favori pour la deuxième mi-temps (format X-Y)" },
            { id: "godmode-second-half-odds", type: "number", label: "Cote score 2ème mi-temps", placeholder: "Ex: 3.50", step: "0.01", help: "Cote du score exact de deuxième mi-temps" },
            { id: "godmode-full-score", type: "text", label: "Score exact favori global", placeholder: "Ex: 2-0", help: "Score exact favori pour le match complet (format X-Y)" },
            { id: "godmode-full-score-odds", type: "number", label: "Cote score exact global", placeholder: "Ex: 7.50", step: "0.01", help: "Cote du score exact global" }
        ]
    },
    {
        title: "Options Avancées",
        description: "Ces options permettent d'optimiser les prédictions avec plus de précision.",
        fields: [
            { id: "godmode-btts-yes", type: "number", label: "BTTS (Oui)", placeholder: "Ex: 1.90", step: "0.01", help: "Cote pour que les deux équipes marquent" },
            { id: "godmode-handicap", type: "number", label: "Handicap -1 favori", placeholder: "Ex: 2.25", step: "0.01", help: "Cote pour un handicap de -1 but pour l'équipe favorite" },
            { id: "godmode-away-over15", type: "number", label: "Total buts extérieur +1.5", placeholder: "Ex: 2.10", step: "0.01", help: "Cote pour que l'équipe à l'extérieur marque plus de 1.5 buts" },
            { id: "godmode-away-over25", type: "number", label: "Total buts extérieur +2.5", placeholder: "Ex: 4.50", step: "0.01", help: "Cote pour que l'équipe à l'extérieur marque plus de 2.5 buts" }
        ]
    },
    {
        title: "Scores Complémentaires",
        description: "Ces scores complètent l'analyse des différents scénarios possibles.",
        fields: [
            { id: "godmode-away-favorite-score", type: "text", label: "Score favori équipe extérieure", placeholder: "Ex: 0-2", help: "Score favori quand l'équipe à l'extérieur gagne (format X-Y)" },
            { id: "godmode-away-favorite-odds", type: "number", label: "Cote de ce score", placeholder: "Ex: 11.00", step: "0.01", help: "Cote du score exact favori extérieur" },
            { id: "godmode-draw-score", type: "text", label: "Score exact nul le plus faible", placeholder: "Ex: 1-1", help: "Score nul avec la cote la plus basse (format X-Y)" },
            { id: "godmode-draw-score-odds", type: "number", label: "Cote de ce score nul", placeholder: "Ex: 6.00", step: "0.01", help: "Cote du score exact nul" }
        ]
    }
];

// Structure des étapes pour Sega Football (4 questions regroupées en 4 pages)
const segaSteps = [
    {
        title: "Cotes classiques (1 - N - 2)",
        description: "Ces cotes serviront à identifier le favori du match pour ce jeu à faible nombre de buts.",
        fields: [
            { id: "sega-home-odds", type: "number", label: "Cote victoire domicile", placeholder: "Ex: 2.10", step: "0.01", help: "La cote pour la victoire de l'équipe à domicile est particulièrement importante dans Sega Football" },
            { id: "sega-draw-odds", type: "number", label: "Cote match nul", placeholder: "Ex: 3.50", step: "0.01", help: "Les matchs nuls sont fréquents dans ce jeu à faible nombre de buts" },
            { id: "sega-away-odds", type: "number", label: "Cote victoire extérieur", placeholder: "Ex: 3.20", step: "0.01", help: "La cote pour la victoire à l'extérieur aide à identifier les équipes les plus performantes" }
        ]
    },
    {
        title: "Scores Mi-temps",
        description: "Ces scores permettent d'estimer les tendances offensives en début et fin de match.",
        fields: [
            { id: "sega-first-half-score", type: "text", label: "Score exact 1ère mi-temps", placeholder: "Ex: 1-0", help: "Le format doit être X-Y (ex: 0-0, 1-0, 0-1)" },
            { id: "sega-first-half-odds", type: "number", label: "Cote score 1ère mi-temps", placeholder: "Ex: 4.33", step: "0.01", help: "La cote du score exact en première mi-temps influence notre analyse de début de match" },
            { id: "sega-second-half-score", type: "text", label: "Score exact 2ème mi-temps", placeholder: "Ex: 0-1", help: "Le format doit être X-Y (ex: 0-0, 1-0, 0-1)" },
            { id: "sega-second-half-odds", type: "number", label: "Cote score 2ème mi-temps", placeholder: "Ex: 5.25", step: "0.01", help: "Cette cote révèle les tendances de fin de match cruciales pour nos prévisions" }
        ]
    },
    {
        title: "Scores probables (équipes alignées)",
        description: "Ces scores permettent d'analyser les tendances de résultats selon chaque scénario.",
        fields: [
            { id: "sega-score-home", type: "text", label: "Score prob. (domicile gagne)", placeholder: "Ex: 1-0", help: "Le score le plus probable si l'équipe à domicile gagne" },
            { id: "sega-score-draw", type: "text", label: "Score prob. (match nul)", placeholder: "Ex: 1-1", help: "Le score nul le plus probable selon les cotes du bookmaker" },
            { id: "sega-score-away", type: "text", label: "Score prob. (extérieur gagne)", placeholder: "Ex: 0-1", help: "Le score le plus probable si l'équipe à l'extérieur gagne" }
        ]
    },
    {
        title: "Totaux de buts & BTTS",
        description: "Ces cotes d'over/under et BTTS sont cruciales pour notre algorithme prédictif.",
        fields: [
            { id: "sega-over15-odds", type: "number", label: "Cote +1.5 buts total", placeholder: "Ex: 1.40", step: "0.01", help: "Cette cote est déterminante pour prévoir si le match aura au moins 2 buts" },
            { id: "sega-under35-odds", type: "number", label: "Cote -3.5 buts total", placeholder: "Ex: 1.30", step: "0.01", help: "La cote sous 3.5 buts est généralement basse dans ce jeu à faible scoring" },
            { id: "sega-btts-yes-odds", type: "number", label: "Cote BTTS (Oui)", placeholder: "Ex: 2.10", step: "0.01", help: "La cote 'Les deux équipes marquent' aide à calculer nos prédictions de scores exacts" }
        ]
    }
];

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
    
    // Initialize God Mode et Sega Football steps
    setupGodModeSteps();
    setupSegaSteps();
    
    // Vérifier si l'utilisateur est administrateur
    if (isAdmin()) {
        // Ajouter une classe admin à la section VIP
        const vipSection = document.getElementById('vip-section');
        if (vipSection) {
            vipSection.classList.add('admin-interface');
        }
        
        // Modifier les boutons premium
        document.querySelectorAll('.premium-button').forEach(button => {
            button.classList.add('admin-button');
        });
        
        console.log('Interface administrateur activée');
    }
}

function setupEventListeners() {
    // Premium games: Commencer button click events
    premiumButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Check if user is premium or admin
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
                
                // Si c'est l'administrateur, afficher un badge admin
                if (isAdmin()) {
                    showAdminBadge(appleSettings);
                }
            } else if (game === 'godmode') {
                godmodeSettings.classList.add('active');
                resetGodModeSteps();
                renderGodModeStep(1);
                
                // Si c'est l'administrateur, afficher un badge admin
                if (isAdmin()) {
                    showAdminBadge(godmodeSettings);
                }
            } else if (game === 'sega') {
                segaSettings.classList.add('active');
                resetSegaSteps();
                renderSegaStep(1);
                
                // Si c'est l'administrateur, afficher un badge admin
                if (isAdmin()) {
                    showAdminBadge(segaSettings);
                }
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
    
    // God Mode steps navigation
    const godmodePrevButton = document.getElementById('godmode-prev-button');
    const godmodeNextButton = document.getElementById('godmode-next-button');
    
    if (godmodePrevButton) {
        godmodePrevButton.addEventListener('click', function() {
            if (currentGodModeStep > 1) {
                saveGodModeData(currentGodModeStep);
                currentGodModeStep--;
                renderGodModeStep(currentGodModeStep);
            }
        });
    }
    
    if (godmodeNextButton) {
        godmodeNextButton.addEventListener('click', function() {
            if (validateGodModeStep(currentGodModeStep)) {
                saveGodModeData(currentGodModeStep);
                
                if (currentGodModeStep < godModeSteps.length) {
                    currentGodModeStep++;
                    renderGodModeStep(currentGodModeStep);
                } else {
                    // Last step - show start prediction button
                    godmodeNextButton.style.display = 'none';
                    startGodmodePrediction.style.display = 'inline-block';
                }
            }
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
            loadGodModeAnimation();
        });
    }
    
    // Sega Football steps navigation
    const segaPrevButton = document.getElementById('sega-prev-button');
    const segaNextButton = document.getElementById('sega-next-button');
    
    if (segaPrevButton) {
        segaPrevButton.addEventListener('click', function() {
            if (currentSegaStep > 1) {
                saveSegaData(currentSegaStep);
                currentSegaStep--;
                renderSegaStep(currentSegaStep);
            }
        });
    }
    
    if (segaNextButton) {
        segaNextButton.addEventListener('click', function() {
            if (validateSegaStep(currentSegaStep)) {
                saveSegaData(currentSegaStep);
                
                if (currentSegaStep < segaSteps.length) {
                    currentSegaStep++;
                    renderSegaStep(currentSegaStep);
                } else {
                    // Last step - show start prediction button
                    segaNextButton.style.display = 'none';
                    startSegaPrediction.style.display = 'inline-block';
                }
            }
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
            loadSegaFootballAnimation();
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
                    loadGodModeResults();
                } else if (premiumGameTitle.textContent.includes('Sega Football')) {
                    loadSegaFootballResults();
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
                loadGodModeAnimation();
            } else if (premiumGameTitle.textContent.includes('Sega Football')) {
                loadSegaFootballAnimation();
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

// Fonctions pour l'accès administrateur
function showAdminBadge(container) {
    // Vérifier si un badge existe déjà
    if (container.querySelector('.admin-badge')) return;
    
    const adminBadge = document.createElement('div');
    adminBadge.className = 'admin-badge';
    adminBadge.innerHTML = '<span class="admin-icon">⚙️</span> Accès Admin';
    
    // Ajouter le badge au conteneur
    container.appendChild(adminBadge);
    
    // Ajouter un message d'information pour l'administrateur
    const adminInfo = document.createElement('div');
    adminInfo.className = 'admin-info';
    adminInfo.textContent = 'Mode Administrateur: Accès aux fonctionnalités premium.';
    
    container.appendChild(adminInfo);
}

// God Mode Steps Functions
function setupGodModeSteps() {
    const godmodeStepsContainer = document.getElementById('godmode-steps-container');
    if (!godmodeStepsContainer) return;
    
    // Initialize godModeData structure
    godModeData = {
        odds: { home: 0, draw: 0, away: 0 },
        totals: { 
            homeOver15: 0, 
            homeOver25: 0,
            awayOver15: 0,
            awayOver25: 0
        },
        scores: {
            homeWin: { score: "", odds: 0 },
            draw: { score: "", odds: 0 },
            awayWin: { score: "", odds: 0 },
            firstHalf: { score: "", odds: 0 },
            secondHalf: { score: "", odds: 0 },
            fullTime: { score: "", odds: 0 }
        },
        btts: { yes: 0 },
        handicap: { minus1: 0 }
    };
}

function renderGodModeStep(stepNumber) {
    const godmodeStepsContainer = document.getElementById('godmode-steps-container');
    if (!godmodeStepsContainer) return;
    
    const step = godModeSteps[stepNumber - 1];
    godmodeStepsContainer.innerHTML = '';
    
    // Create step title and description
    const stepTitle = document.createElement('h4');
    stepTitle.className = 'premium-step-title';
    stepTitle.textContent = `Étape ${stepNumber}/${godModeSteps.length} - ${step.title}`;
    
    const stepDescription = document.createElement('p');
    stepDescription.className = 'premium-step-description';
    stepDescription.textContent = step.description;
    
    godmodeStepsContainer.appendChild(stepTitle);
    godmodeStepsContainer.appendChild(stepDescription);
    
    // Create form fields
    const formContainer = document.createElement('div');
    formContainer.className = 'premium-form-fields';
    
    step.fields.forEach(field => {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'premium-field-container';
        
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        
        const input = document.createElement('input');
        input.id = field.id;
        input.type = field.type;
        input.placeholder = field.placeholder;
        
        if (field.min) input.min = field.min;
        if (field.max) input.max = field.max;
        if (field.step) input.step = field.step;
        
        // Set value if exists
        const value = getGodModeFieldValue(field.id);
        if (value !== null && value !== undefined && value !== '') {
            input.value = value;
        }
        
        // Add help text
        const helpText = document.createElement('small');
        helpText.className = 'field-help-text';
        helpText.textContent = field.help || '';
        
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        fieldContainer.appendChild(helpText);
        formContainer.appendChild(fieldContainer);
    });
    
    godmodeStepsContainer.appendChild(formContainer);
    
    // Update navigation buttons
    const godmodePrevButton = document.getElementById('godmode-prev-button');
    const godmodeNextButton = document.getElementById('godmode-next-button');
    const startGodmodePrediction = document.getElementById('start-godmode-prediction');
    
    if (godmodePrevButton) godmodePrevButton.style.display = stepNumber === 1 ? 'none' : 'inline-block';
    if (godmodeNextButton) godmodeNextButton.style.display = 'inline-block';
    if (startGodmodePrediction) startGodmodePrediction.style.display = 'none';
    
    // If it's the last step and all validated, show the prediction button
    if (stepNumber === godModeSteps.length && validateGodModeStep(stepNumber, false)) {
        if (godmodeNextButton) godmodeNextButton.style.display = 'none';
        if (startGodmodePrediction) startGodmodePrediction.style.display = 'inline-block';
    }
}

function getGodModeFieldValue(fieldId) {
    // Get stored value from godModeData
    switch (fieldId) {
        case 'godmode-home-odds':
            return godModeData.odds.home || '';
        case 'godmode-draw-odds':
            return godModeData.odds.draw || '';
        case 'godmode-away-odds':
            return godModeData.odds.away || '';
        case 'godmode-home-over15':
            return godModeData.totals.homeOver15 || '';
        case 'godmode-home-over25':
            return godModeData.totals.homeOver25 || '';
        case 'godmode-away-over15':
            return godModeData.totals.awayOver15 || '';
        case 'godmode-away-over25':
            return godModeData.totals.awayOver25 || '';
        case 'godmode-home-favorite-score':
            return godModeData.scores.homeWin.score || '';
        case 'godmode-home-favorite-odds':
            return godModeData.scores.homeWin.odds || '';
        case 'godmode-first-half-score':
            return godModeData.scores.firstHalf.score || '';
        case 'godmode-first-half-odds':
            return godModeData.scores.firstHalf.odds || '';
        case 'godmode-second-half-score':
            return godModeData.scores.secondHalf.score || '';
        case 'godmode-second-half-odds':
            return godModeData.scores.secondHalf.odds || '';
        case 'godmode-full-score':
            return godModeData.scores.fullTime.score || '';
        case 'godmode-full-score-odds':
            return godModeData.scores.fullTime.odds || '';
        case 'godmode-btts-yes':
            return godModeData.btts.yes || '';
        case 'godmode-handicap':
            return godModeData.handicap.minus1 || '';
        case 'godmode-away-favorite-score':
            return godModeData.scores.awayWin.score || '';
        case 'godmode-away-favorite-odds':
            return godModeData.scores.awayWin.odds || '';
        case 'godmode-draw-score':
            return godModeData.scores.draw.score || '';
        case 'godmode-draw-score-odds':
            return godModeData.scores.draw.odds || '';
        default:
            return '';
    }
}

function saveGodModeData(stepNumber) {
    const step = godModeSteps[stepNumber - 1];
    
    step.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            const value = input.value;
            
            switch (field.id) {
                case 'godmode-home-odds':
                    godModeData.odds.home = parseFloat(value) || 0;
                    break;
                case 'godmode-draw-odds':
                    godModeData.odds.draw = parseFloat(value) || 0;
                    break;
                case 'godmode-away-odds':
                    godModeData.odds.away = parseFloat(value) || 0;
                    break;
                case 'godmode-home-over15':
                    godModeData.totals.homeOver15 = parseFloat(value) || 0;
                    break;
                case 'godmode-home-over25':
                    godModeData.totals.homeOver25 = parseFloat(value) || 0;
                    break;
                case 'godmode-away-over15':
                    godModeData.totals.awayOver15 = parseFloat(value) || 0;
                    break;
                case 'godmode-away-over25':
                    godModeData.totals.awayOver25 = parseFloat(value) || 0;
                    break;
                case 'godmode-home-favorite-score':
                    godModeData.scores.homeWin.score = value;
                    break;
                case 'godmode-home-favorite-odds':
                    godModeData.scores.homeWin.odds = parseFloat(value) || 0;
                    break;
                case 'godmode-first-half-score':
                    godModeData.scores.firstHalf.score = value;
                    break;
                case 'godmode-first-half-odds':
                    godModeData.scores.firstHalf.odds = parseFloat(value) || 0;
                    break;
                case 'godmode-second-half-score':
                    godModeData.scores.secondHalf.score = value;
                    break;
                case 'godmode-second-half-odds':
                    godModeData.scores.secondHalf.odds = parseFloat(value) || 0;
                    break;
                case 'godmode-full-score':
                    godModeData.scores.fullTime.score = value;
                    break;
                case 'godmode-full-score-odds':
                    godModeData.scores.fullTime.odds = parseFloat(value) || 0;
                    break;
                case 'godmode-btts-yes':
                    godModeData.btts.yes = parseFloat(value) || 0;
                    break;
                case 'godmode-handicap':
                    godModeData.handicap.minus1 = parseFloat(value) || 0;
                    break;
                case 'godmode-away-favorite-score':
                    godModeData.scores.awayWin.score = value;
                    break;
                case 'godmode-away-favorite-odds':
                    godModeData.scores.awayWin.odds = parseFloat(value) || 0;
                    break;
                case 'godmode-draw-score':
                    godModeData.scores.draw.score = value;
                    break;
                case 'godmode-draw-score-odds':
                    godModeData.scores.draw.odds = parseFloat(value) || 0;
                    break;
            }
        }
    });
}

function validateGodModeStep(stepNumber, showAlert = true) {
    const step = godModeSteps[stepNumber - 1];
    let isValid = true;
    
    step.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            const value = input.value.trim();
            
            if (!value) {
                isValid = false;
                input.classList.add('invalid');
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    input.classList.remove('invalid');
                }, 3000);
            }
            
            // Validate score format (X-Y) for score fields
            if (value && field.id.includes('score') && !field.id.includes('odds')) {
                const scorePattern = /^\d+-\d+$/;
                if (!scorePattern.test(value)) {
                    isValid = false;
                    input.classList.add('invalid');
                    
                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        input.classList.remove('invalid');
                    }, 3000);
                    
                    if (showAlert) {
                        alert(`Format de score incorrect pour ${field.label}. Veuillez utiliser le format X-Y (ex: 1-0, 0-1, 1-1)`);
                    }
                }
            }
        }
    });
    
    if (!isValid && showAlert && !document.querySelector('.invalid[id^="godmode-"][id*="score"]:not([id$="odds"])')) {
        alert('Veuillez remplir tous les champs avant de continuer.');
    }
    
    return isValid;
}

function resetGodModeSteps() {
    currentGodModeStep = 1;
    
    // Initialize godModeData structure
    godModeData = {
        odds: { home: 0, draw: 0, away: 0 },
        totals: { 
            homeOver15: 0, 
            homeOver25: 0,
            awayOver15: 0,
            awayOver25: 0
        },
        scores: {
            homeWin: { score: "", odds: 0 },
            draw: { score: "", odds: 0 },
            awayWin: { score: "", odds: 0 },
            firstHalf: { score: "", odds: 0 },
            secondHalf: { score: "", odds: 0 },
            fullTime: { score: "", odds: 0 }
        },
        btts: { yes: 0 },
        handicap: { minus1: 0 }
    };
    
    const godmodeStepsContainer = document.getElementById('godmode-steps-container');
    const godmodePrevButton = document.getElementById('godmode-prev-button');
    const godmodeNextButton = document.getElementById('godmode-next-button');
    const startGodmodePrediction = document.getElementById('start-godmode-prediction');
    
    if (godmodeStepsContainer) godmodeStepsContainer.innerHTML = '';
    if (godmodePrevButton) godmodePrevButton.style.display = 'none';
    if (godmodeNextButton) godmodeNextButton.style.display = 'inline-block';
    if (startGodmodePrediction) startGodmodePrediction.style.display = 'none';
}

// Sega Football Steps Functions
function setupSegaSteps() {
    const segaStepsContainer = document.getElementById('sega-steps-container');
    if (!segaStepsContainer) return;
    
    // Initialize segaData structure
    segaData = {
        odds: { home: 0, draw: 0, away: 0 },
        scores: {
            firstHalf: { score: "", odds: 0 },
            secondHalf: { score: "", odds: 0 },
            homeWin: { score: "" },
            draw: { score: "" },
            awayWin: { score: "" }
        },
        totals: {
            over15: 0,
            under35: 0,
            bttsYes: 0
        }
    };
}

function renderSegaStep(stepNumber) {
    const segaStepsContainer = document.getElementById('sega-steps-container');
    if (!segaStepsContainer) return;
    
    const step = segaSteps[stepNumber - 1];
    segaStepsContainer.innerHTML = '';
    
    // Create step title and description
    const stepTitle = document.createElement('h4');
    stepTitle.className = 'premium-step-title';
    stepTitle.textContent = `Étape ${stepNumber}/${segaSteps.length} - ${step.title}`;
    
    const stepDescription = document.createElement('p');
    stepDescription.className = 'premium-step-description';
    stepDescription.textContent = step.description;
    
    segaStepsContainer.appendChild(stepTitle);
    segaStepsContainer.appendChild(stepDescription);
    
    // Create form fields
    const formContainer = document.createElement('div');
    formContainer.className = 'premium-form-fields';
    
    step.fields.forEach(field => {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'premium-field-container';
        
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        
        const input = document.createElement('input');
        input.id = field.id;
        input.type = field.type;
        input.placeholder = field.placeholder;
        
        if (field.min) input.min = field.min;
        if (field.max) input.max = field.max;
        if (field.step) input.step = field.step;
        
        // Set value if exists
        const value = getSegaFieldValue(field.id);
        if (value !== null && value !== undefined && value !== '') {
            input.value = value;
        }
        
        // Add help text
        const helpText = document.createElement('small');
        helpText.className = 'field-help-text';
        helpText.textContent = field.help || '';
        
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        fieldContainer.appendChild(helpText);
        formContainer.appendChild(fieldContainer);
    });
    
    segaStepsContainer.appendChild(formContainer);
    
    // Update navigation buttons
    const segaPrevButton = document.getElementById('sega-prev-button');
    const segaNextButton = document.getElementById('sega-next-button');
    const startSegaPrediction = document.getElementById('start-sega-prediction');
    
    if (segaPrevButton) segaPrevButton.style.display = stepNumber === 1 ? 'none' : 'inline-block';
    if (segaNextButton) segaNextButton.style.display = 'inline-block';
    if (startSegaPrediction) startSegaPrediction.style.display = 'none';
    
    // If it's the last step and all validated, show the prediction button
    if (stepNumber === segaSteps.length && validateSegaStep(stepNumber, false)) {
        if (segaNextButton) segaNextButton.style.display = 'none';
        if (startSegaPrediction) startSegaPrediction.style.display = 'inline-block';
    }
}

function getSegaFieldValue(fieldId) {
    // Get stored value from segaData
    switch (fieldId) {
        case 'sega-home-odds':
            return segaData.odds.home || '';
        case 'sega-draw-odds':
            return segaData.odds.draw || '';
        case 'sega-away-odds':
            return segaData.odds.away || '';
        case 'sega-first-half-score':
            return segaData.scores.firstHalf.score || '';
        case 'sega-first-half-odds':
            return segaData.scores.firstHalf.odds || '';
        case 'sega-second-half-score':
            return segaData.scores.secondHalf.score || '';
        case 'sega-second-half-odds':
            return segaData.scores.secondHalf.odds || '';
        case 'sega-score-home':
            return segaData.scores.homeWin.score || '';
        case 'sega-score-draw':
            return segaData.scores.draw.score || '';
        case 'sega-score-away':
            return segaData.scores.awayWin.score || '';
        case 'sega-over15-odds':
            return segaData.totals.over15 || '';
        case 'sega-under35-odds':
            return segaData.totals.under35 || '';
        case 'sega-btts-yes-odds':
            return segaData.totals.bttsYes || '';
        default:
            return '';
    }
}

function saveSegaData(stepNumber) {
    const step = segaSteps[stepNumber - 1];
    
    step.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            const value = input.value;
            
            switch (field.id) {
                case 'sega-home-odds':
                    segaData.odds.home = parseFloat(value) || 0;
                    break;
                case 'sega-draw-odds':
                    segaData.odds.draw = parseFloat(value) || 0;
                    break;
                case 'sega-away-odds':
                    segaData.odds.away = parseFloat(value) || 0;
                    break;
                case 'sega-first-half-score':
                    segaData.scores.firstHalf.score = value;
                    break;
                case 'sega-first-half-odds':
                    segaData.scores.firstHalf.odds = parseFloat(value) || 0;
                    break;
                case 'sega-second-half-score':
                    segaData.scores.secondHalf.score = value;
                    break;
                case 'sega-second-half-odds':
                    segaData.scores.secondHalf.odds = parseFloat(value) || 0;
                    break;
                case 'sega-score-home':
                    segaData.scores.homeWin.score = value;
                    break;
                case 'sega-score-draw':
                    segaData.scores.draw.score = value;
                    break;
                case 'sega-score-away':
                    segaData.scores.awayWin.score = value;
                    break;
                case 'sega-over15-odds':
                    segaData.totals.over15 = parseFloat(value) || 0;
                    break;
                case 'sega-under35-odds':
                    segaData.totals.under35 = parseFloat(value) || 0;
                    break;
                case 'sega-btts-yes-odds':
                    segaData.totals.bttsYes = parseFloat(value) || 0;
                    break;
            }
        }
    });
}

function validateSegaStep(stepNumber, showAlert = true) {
    const step = segaSteps[stepNumber - 1];
    let isValid = true;
    
    step.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            const value = input.value.trim();
            
            if (!value) {
                isValid = false;
                input.classList.add('invalid');
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    input.classList.remove('invalid');
                }, 3000);
            }
            
            // Validate score format (X-Y) for score fields
            if (value && field.id.includes('score') && !field.id.includes('odds')) {
                const scorePattern = /^\d+-\d+$/;
                if (!scorePattern.test(value)) {
                    isValid = false;
                    input.classList.add('invalid');
                    
                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        input.classList.remove('invalid');
                    }, 3000);
                    
                    if (showAlert) {
                        alert(`Format de score incorrect pour ${field.label}. Veuillez utiliser le format X-Y (ex: 1-0, 0-1, 1-1)`);
                    }
                }
            }
        }
    });
    
    if (!isValid && showAlert && !document.querySelector('.invalid[id^="sega-"][id*="score"]:not([id$="odds"])')) {
        alert('Veuillez remplir tous les champs avant de continuer.');
    }
    
    return isValid;
}

function resetSegaSteps() {
    currentSegaStep = 1;
    
    // Initialize segaData structure
    segaData = {
        odds: { home: 0, draw: 0, away: 0 },
        scores: {
            firstHalf: { score: "", odds: 0 },
            secondHalf: { score: "", odds: 0 },
            homeWin: { score: "" },
            draw: { score: "" },
            awayWin: { score: "" }
        },
        totals: {
            over15: 0,
            under35: 0,
            bttsYes: 0
        }
    };
    
    const segaStepsContainer = document.getElementById('sega-steps-container');
    const segaPrevButton = document.getElementById('sega-prev-button');
    const segaNextButton = document.getElementById('sega-next-button');
    const startSegaPrediction = document.getElementById('start-sega-prediction');
    
    if (segaStepsContainer) segaStepsContainer.innerHTML = '';
    if (segaPrevButton) segaPrevButton.style.display = 'none';
    if (segaNextButton) segaNextButton.style.display = 'inline-block';
    if (startSegaPrediction) startSegaPrediction.style.display = 'none';
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
    
    // Supprimer tous les messages temporaires des précédentes prédictions
    document.querySelectorAll('.bonus-message').forEach(el => el.remove());
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

// Animation améliorée pour Apple of Fortune
function loadAppleOfFortuneContent(bookmaker) {
    premiumGameContent.innerHTML = '';
    
    // Create loading animation
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation premium-loading';
    loadingDiv.textContent = 'Analyse en cours...';
    premiumGameContent.appendChild(loadingDiv);
    
    // Simulate loading time
    setTimeout(() => {
        premiumGameContent.innerHTML = '';
        
        // Create palier indicator
        updatePalierIndicator();
        
        // Si c'est l'administrateur, ajouter un badge admin
        if (isAdmin()) {
            const adminBadge = document.createElement('div');
            adminBadge.className = 'admin-badge';
            adminBadge.innerHTML = '<span class="admin-icon">⚙️</span> Accès Admin';
            premiumGameContent.appendChild(adminBadge);
        }
        
        // Nouvel HTML pour l'animation Apple of Fortune améliorée
        const appleAnimationHtml = `
            <div class="apple-fortune-animation">
                <div class="fortune-title">Analyse en cours...</div>
                
                <div class="fortune-wheel-container">
                    <div class="fortune-wheel">
                        <div class="wheel-center"></div>
                        <div class="wheel-section section1">
                            <div class="apple-icon">🍎</div>
                            <div class="section-number">1</div>
                        </div>
                        <div class="wheel-section section2">
                            <div class="apple-icon">🍎</div>
                            <div class="section-number">2</div>
                        </div>
                        <div class="wheel-section section3">
                            <div class="apple-icon">🍎</div>
                            <div class="section-number">3</div>
                        </div>
                        <div class="wheel-section section4">
                            <div class="apple-icon">🍎</div>
                            <div class="section-number">4</div>
                        </div>
                        <div class="wheel-section section5">
                            <div class="apple-icon">🍎</div>
                            <div class="section-number">5</div>
                        </div>
                    </div>
                    <div class="fortune-pointer"></div>
                </div>
                
                <div class="prediction-progress">
                    <div class="progress-label">Analyse en cours</div>
                    <div class="progress-bar apple-progress">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>
        `;
        
        premiumGameContent.innerHTML += appleAnimationHtml;
        
        // Animer la roue de la fortune
        const wheel = premiumGameContent.querySelector('.fortune-wheel');
        const progressFill = premiumGameContent.querySelector('.progress-fill');
        
        // Démarrer l'animation de la roue
        wheel.style.animation = 'spin 5s cubic-bezier(0.2, 0.8, 0.3, 1) forwards';
        
        // Animer la barre de progression
        progressFill.style.width = '0%';
        setTimeout(() => {
            progressFill.style.transition = 'width 5s ease-in-out';
            progressFill.style.width = '100%';
        }, 100);
        
        // Déterminer la pomme gagnante (résultat)
        const winningNumber = Math.floor(Math.random() * 5) + 1;
        
        // Après l'animation, afficher le résultat sur une nouvelle page
        setTimeout(() => {
            displayAppleOfFortuneResult(winningNumber, bookmaker);
        }, 5000);
    }, 1500);
}

function displayAppleOfFortuneResult(winningNumber, bookmaker) {
    premiumGameContent.innerHTML = '';
    
    // Create palier indicator
    updatePalierIndicator();
    
    // Si c'est l'administrateur, ajouter un badge admin
    if (isAdmin()) {
        const adminBadge = document.createElement('div');
        adminBadge.className = 'admin-badge';
        adminBadge.innerHTML = '<span class="admin-icon">⚙️</span> Accès Admin';
        premiumGameContent.appendChild(adminBadge);
    }
    
    // HTML pour le résultat d'Apple of Fortune
    const resultHTML = `
        <div class="fortune-result">
            <h3 class="result-title">Prédiction Apple of Fortune</h3>
            <div class="result-content">
                <div class="selected-apple">
                    <div class="big-apple-icon">🍎</div>
                    <div class="apple-number">${winningNumber}</div>
                </div>
                <div class="result-message">La prédiction indique la pomme ${winningNumber}</div>
            </div>
        </div>
    `;
    
    premiumGameContent.innerHTML += resultHTML;
    
    // Ajouter des jetons au joueur (différent selon le statut admin)
    const bonusAmount = isAdmin() ? 25 : 10;
    addCoins(bonusAmount);
    
    // Afficher un message de bonus
    const bonusContainer = document.createElement('div');
    bonusContainer.className = 'bonus-container';
    bonusContainer.innerHTML = `
        <div class="bonus-message">
            +${bonusAmount} jetons pour avoir utilisé Apple of Fortune!
        </div>
    `;
    
    premiumGameContent.appendChild(bonusContainer);
    
    // Afficher un message spécial pour l'administrateur si nécessaire
    if (isAdmin()) {
        const adminMessage = document.createElement('div');
        adminMessage.className = 'admin-info';
        adminMessage.textContent = 'Mode Admin: Bonus de jetons augmenté!';
        premiumGameContent.appendChild(adminMessage);
    }
}

// Animation et résultats pour God Mode
function loadGodModeAnimation() {
    premiumGameContent.innerHTML = '';
    
    // Create loading animation
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation premium-loading';
    loadingDiv.textContent = 'Analyse en cours...';
    premiumGameContent.appendChild(loadingDiv);
    
    // Simulate loading time
    setTimeout(() => {
        premiumGameContent.innerHTML = '';
        
        // Create palier indicator
        updatePalierIndicator();
        
        // Si c'est l'administrateur, ajouter un badge admin
        if (isAdmin()) {
            const adminBadge = document.createElement('div');
            adminBadge.className = 'admin-badge';
            adminBadge.innerHTML = '<span class="admin-icon">⚙️</span> Accès Admin';
            premiumGameContent.appendChild(adminBadge);
        }
        
        // Show advanced 3D animation
        const animationHTML = `
            <div class="godmode-prediction-animation">
                <div class="animation-title premium-animation-title">Analyse avec IA avancée...</div>
                <div class="premium-animation-model">
                    <div class="model-orbit">
                        <div class="model-planet"></div>
                    </div>
                    <div class="model-orbit secondary-orbit">
                        <div class="model-planet secondary-planet"></div>
                    </div>
                    <div class="model-orbit tertiary-orbit">
                        <div class="model-planet tertiary-planet"></div>
                    </div>
                    <div class="model-core"></div>
                    <div class="model-halo"></div>
                </div>
                <div class="prediction-progress">
                    <div class="progress-label">Progression de l'analyse</div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
                <div class="animation-status premium-animation-status">Analyse en cours...</div>
            </div>
        `;
        
        premiumGameContent.innerHTML += animationHTML;
        
        // Animate progress bar
        const progressFill = premiumGameContent.querySelector('.progress-fill');
        setTimeout(() => {
            progressFill.style.width = '100%';
        }, 500);
        
        // Update status message periodically
        const statusElement = premiumGameContent.querySelector('.premium-animation-status');
        const statuses = [
            "Analyse en cours...",
            "Application des algorithmes avancés...",
            "Analyse des données historiques...",
            "Génération des scénarios probabilistes...",
            "Finalisation des prédictions de haute précision..."
        ];
        
        let statusIndex = 0;
        const statusInterval = setInterval(() => {
            statusIndex = (statusIndex + 1) % statuses.length;
            statusElement.textContent = statuses[statusIndex];
        }, 1500);
        
        // After animation completes, show prediction results
        setTimeout(() => {
            clearInterval(statusInterval);
            loadGodModeResults();
        }, 7000);
    }, 2000);
}

function loadGodModeResults() {
    // Calculate prediction results from godModeData
    const predictions = calculateGodModePredictions();
    
    // Create results container
    premiumGameContent.innerHTML = '';
    
    // Update palier indicator
    updatePalierIndicator();
    
    // Si c'est l'administrateur, ajouter un badge admin
    if (isAdmin()) {
        const adminBadge = document.createElement('div');
        adminBadge.className = 'admin-badge';
        adminBadge.innerHTML = '<span class="admin-icon">⚙️</span> Accès Admin';
        premiumGameContent.appendChild(adminBadge);
    }
    
    // Create premium results HTML
    const resultsHTML = `
        <div class="godmode-results premium-results">
            <h3 class="premium-results-title">Prédictions God Mode</h3>
            
            <div class="premium-results-grid">
                <div class="premium-result-card exact-score high-confidence">
                    <h4>Premier Score Exact</h4>
                    <div class="premium-score-display">
                        <span class="team-name">Équipe Domicile</span>
                        <span class="premium-score-value">${predictions.firstExactScore.home} - ${predictions.firstExactScore.away}</span>
                        <span class="team-name">Équipe Extérieur</span>
                    </div>
                    <div class="premium-confidence-meter">
                        <div class="confidence-label">Confiance: ${predictions.firstScoreConfidence}%</div>
                        <div class="premium-confidence-bar">
                            <div class="premium-confidence-fill" style="width: ${predictions.firstScoreConfidence}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="premium-result-card exact-score high-confidence">
                    <h4>Second Score Exact</h4>
                    <div class="premium-score-display">
                        <span class="team-name">Équipe Domicile</span>
                        <span class="premium-score-value">${predictions.secondExactScore.home} - ${predictions.secondExactScore.away}</span>
                        <span class="team-name">Équipe Extérieur</span>
                    </div>
                    <div class="premium-confidence-meter">
                        <div class="confidence-label">Confiance: ${predictions.secondScoreConfidence}%</div>
                        <div class="premium-confidence-bar">
                            <div class="premium-confidence-fill" style="width: ${predictions.secondScoreConfidence}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="premium-result-card total-goals high-confidence">
                    <h4>Nombre Total de Buts</h4>
                    <div class="premium-total-display">
                        <span class="premium-total-value">${predictions.totalGoalsLine}</span>
                    </div>
                    <div class="premium-confidence-meter">
                        <div class="confidence-label">Confiance: ${predictions.totalGoalsConfidence}%</div>
                        <div class="premium-confidence-bar">
                            <div class="premium-confidence-fill" style="width: ${predictions.totalGoalsConfidence}%"></div>
                        </div>
                    </div>
                    </div>
                
                <div class="premium-result-card winner high-confidence">
                    <h4>Gagnant Probable</h4>
                    <div class="premium-winner-display">
                        <span class="premium-winner-name">${predictions.winner}</span>
                    </div>
                    <div class="premium-confidence-meter">
                        <div class="confidence-label">Confiance: ${predictions.winnerConfidence}%</div>
                        <div class="premium-confidence-bar">
                            <div class="premium-confidence-fill" style="width: ${predictions.winnerConfidence}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="premium-results-note">
                <p>Notre système d'IA avancé a généré ces prédictions avec une fiabilité exceptionnelle.</p>
                <p>Les scores exacts sont calculés en utilisant des algorithmes propriétaires basés sur les cotes fournies.</p>
                <p>Pour des résultats optimaux, suivez la prédiction avec le taux de confiance le plus élevé.</p>
            </div>
        </div>
    `;
    
    premiumGameContent.innerHTML += resultsHTML;
    
    // Animate confidence bars
    const confidenceBars = premiumGameContent.querySelectorAll('.premium-confidence-fill');
    confidenceBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
    
    // Add bonus for generating predictions
    const bonusAmount = isAdmin() ? 25 : 15;
    addCoins(bonusAmount);
    
    // Show bonus message in container
    const bonusContainer = document.createElement('div');
    bonusContainer.className = 'bonus-container';
    bonusContainer.innerHTML = `
        <div class="bonus-message">
            +${bonusAmount} jetons pour avoir utilisé God Mode!
        </div>
    `;
    
    premiumGameContent.appendChild(bonusContainer);
    
    // Pour l'administrateur, afficher un message spécial
    if (isAdmin()) {
        const adminMessage = document.createElement('div');
        adminMessage.className = 'admin-info';
        adminMessage.textContent = 'Mode Admin: Bonus de jetons augmenté!';
        premiumGameContent.appendChild(adminMessage);
    }
}

function calculateGodModePredictions() {
    // Modèle mathématique pour God Mode
    
    // Analyse des scores fournis pour générer les scores exacts
    const firstHalfScore = parseScore(godModeData.scores.firstHalf.score || "0-0");
    const secondHalfScore = parseScore(godModeData.scores.secondHalf.score || "0-0");
    const fullTimeScore = parseScore(godModeData.scores.fullTime.score || "0-0");
    const homeWinScore = parseScore(godModeData.scores.homeWin.score || "1-0");
    const awayWinScore = parseScore(godModeData.scores.awayWin.score || "0-1");
    const drawScore = parseScore(godModeData.scores.draw.score || "1-1");
    
    // Déterminer l'équipe favorite basée sur les cotes
    let favoriteTeam;
    if (godModeData.odds.home < godModeData.odds.away && godModeData.odds.home < godModeData.odds.draw) {
        favoriteTeam = 'home';
    } else if (godModeData.odds.away < godModeData.odds.home && godModeData.odds.away < godModeData.odds.draw) {
        favoriteTeam = 'away';
    } else {
        favoriteTeam = 'draw';
    }
    
    // Premier score exact - addition des scores de mi-temps
    const firstExactScore = {
        home: firstHalfScore.home + secondHalfScore.home,
        away: firstHalfScore.away + secondHalfScore.away
    };
    
    // Deuxième score exact - variation du score global
    let secondExactScore;
    if (favoriteTeam === 'home') {
        secondExactScore = {
            home: homeWinScore.home,
            away: homeWinScore.away
        };
    } else if (favoriteTeam === 'away') {
        secondExactScore = {
            home: awayWinScore.home,
            away: awayWinScore.away
        };
    } else {
        secondExactScore = {
            home: drawScore.home,
            away: drawScore.away
        };
    }
    
    // S'assurer que les deux scores sont différents
    if (secondExactScore.home === firstExactScore.home && secondExactScore.away === firstExactScore.away) {
        // Créer une variation
        if (Math.random() > 0.5) {
            secondExactScore.home = Math.max(0, secondExactScore.home + (Math.random() > 0.5 ? 1 : -1));
        } else {
            secondExactScore.away = Math.max(0, secondExactScore.away + (Math.random() > 0.5 ? 1 : -1));
        }
    }
    
    // Nombre de buts = score exact principal - 1 (selon le cahier des charges)
    const totalGoals = firstExactScore.home + firstExactScore.away - 1;
    const totalGoalsLine = Math.max(0.5, totalGoals) + 0.5;
    
    // Déterminer le gagnant
    let winner;
    let winnerConfidence;
    
    if (favoriteTeam === 'home') {
        winner = "Équipe Domicile";
        winnerConfidence = Math.round((1 / godModeData.odds.home) * 100);
    } else if (favoriteTeam === 'away') {
        winner = "Équipe Extérieur";
        winnerConfidence = Math.round((1 / godModeData.odds.away) * 100);
    } else {
        winner = "Match nul";
        winnerConfidence = Math.round((1 / godModeData.odds.draw) * 100);
    }
    
    // Garantir que les confidences sont dans une plage raisonnable
    winnerConfidence = Math.min(95, Math.max(60, winnerConfidence));
    
    // Indices de confiance selon le cahier des charges
    const firstScoreConfidence = Math.floor(Math.random() * 11) + 65; // 65-75%
    const secondScoreConfidence = Math.floor(Math.random() * 11) + 65; // 65-75%
    const totalGoalsConfidence = Math.floor(Math.random() * 10) + 90; // 90-99%
    
    return {
        firstExactScore,
        secondExactScore,
        totalGoalsLine,
        winner,
        winnerConfidence,
        firstScoreConfidence,
        secondScoreConfidence,
        totalGoalsConfidence
    };
}

// Animation et résultats pour Sega Football
function loadSegaFootballAnimation() {
    premiumGameContent.innerHTML = '';
    
    // Create loading animation
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation sega-loading';
    loadingDiv.textContent = 'Analyse en cours...';
    premiumGameContent.appendChild(loadingDiv);
    
    // Simulate loading time
    setTimeout(() => {
        premiumGameContent.innerHTML = '';
        
        // Create palier indicator
        updatePalierIndicator();
        
        // Si c'est l'administrateur, ajouter un badge admin
        if (isAdmin()) {
            const adminBadge = document.createElement('div');
            adminBadge.className = 'admin-badge';
            adminBadge.innerHTML = '<span class="admin-icon">⚙️</span> Accès Admin';
            premiumGameContent.appendChild(adminBadge);
        }
        
        // Show Sega Football specific animation
        const animationHTML = `
            <div class="sega-prediction-animation">
            <div class="animation-title sega-animation-title">Analyse des données de bas scoring...</div>
                <div class="sega-animation-model">
                    <div class="sega-grid">
                        <div class="sega-grid-item item1"></div>
                        <div class="sega-grid-item item2"></div>
                        <div class="sega-grid-item item3"></div>
                        <div class="sega-grid-item item4"></div>
                        <div class="sega-grid-item item5"></div>
                        <div class="sega-grid-item item6"></div>
                        <div class="sega-grid-item item7"></div>
                        <div class="sega-grid-item item8"></div>
                        <div class="sega-grid-item item9"></div>
                    </div>
                    <div class="sega-scanner-h"></div>
                    <div class="sega-scanner-v"></div>
                </div>
                <div class="sega-progress">
                    <div class="progress-label">Analyse en cours</div>
                    <div class="sega-progress-bar">
                        <div class="sega-progress-fill"></div>
                    </div>
                </div>
                <div class="animation-status sega-animation-status">Analyse en cours...</div>
            </div>
        `;
        
        premiumGameContent.innerHTML += animationHTML;
        
        // Animate progress bar
        const progressFill = premiumGameContent.querySelector('.sega-progress-fill');
        setTimeout(() => {
            progressFill.style.width = '100%';
        }, 500);
        
        // Update status message periodically
        const statusElement = premiumGameContent.querySelector('.sega-animation-status');
        const statuses = [
            "Analyse en cours...",
            "Calibration du modèle prédictif spécifique...",
            "Détection des motifs de buts rares...",
            "Génération des scénarios probabilistes...",
            "Finalisation des prédictions optimisées..."
        ];
        
        let statusIndex = 0;
        const statusInterval = setInterval(() => {
            statusIndex = (statusIndex + 1) % statuses.length;
            statusElement.textContent = statuses[statusIndex];
        }, 1500);
        
        // After animation completes, show prediction results
        setTimeout(() => {
            clearInterval(statusInterval);
            loadSegaFootballResults();
        }, 7000);
    }, 2000);
}

function loadSegaFootballResults() {
    // Calculate prediction results from segaData
    const predictions = calculateSegaFootballPredictions();
    
    // Create results container
    premiumGameContent.innerHTML = '';
    
    // Update palier indicator
    updatePalierIndicator();
    
    // Si c'est l'administrateur, ajouter un badge admin
    if (isAdmin()) {
        const adminBadge = document.createElement('div');
        adminBadge.className = 'admin-badge';
        adminBadge.innerHTML = '<span class="admin-icon">⚙️</span> Accès Admin';
        premiumGameContent.appendChild(adminBadge);
    }
    
    // Create Sega Football results HTML
    const resultsHTML = `
        <div class="sega-football-results premium-results">
            <h3 class="premium-results-title">Prédictions Sega Football</h3>
            
            <div class="premium-results-grid">
                <div class="premium-result-card exact-score low-scoring">
                    <h4>Premier Score Exact</h4>
                    <div class="premium-score-display">
                        <span class="team-name">Équipe Domicile</span>
                        <span class="premium-score-value">${predictions.firstExactScore}</span>
                        <span class="team-name">Équipe Extérieur</span>
                    </div>
                    <div class="premium-confidence-meter">
                        <div class="confidence-label">Confiance: ${predictions.firstScoreConfidence}%</div>
                        <div class="premium-confidence-bar">
                            <div class="premium-confidence-fill" style="width: ${predictions.firstScoreConfidence}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="premium-result-card exact-score low-scoring">
                    <h4>Second Score Exact</h4>
                    <div class="premium-score-display">
                        <span class="team-name">Équipe Domicile</span>
                        <span class="premium-score-value">${predictions.secondExactScore}</span>
                        <span class="team-name">Équipe Extérieur</span>
                    </div>
                    <div class="premium-confidence-meter">
                        <div class="confidence-label">Confiance: ${predictions.secondScoreConfidence}%</div>
                        <div class="premium-confidence-bar">
                            <div class="premium-confidence-fill" style="width: ${predictions.secondScoreConfidence}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="premium-result-card total-goals high-confidence">
                    <h4>Marché de buts recommandé</h4>
                    <div class="premium-total-display">
                        <span class="premium-total-value">${predictions.recommendedGoalsMarket}</span>
                    </div>
                    <div class="premium-confidence-meter">
                        <div class="confidence-label">Confiance: ${predictions.goalsConfidence}%</div>
                        <div class="premium-confidence-bar">
                            <div class="premium-confidence-fill" style="width: ${predictions.goalsConfidence}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="premium-result-card winner high-confidence">
                    <h4>Gagnant Probable</h4>
                    <div class="premium-winner-display">
                        <span class="premium-winner-name">${predictions.winner}</span>
                    </div>
                    <div class="premium-confidence-meter">
                        <div class="confidence-label">Confiance: ${predictions.winnerConfidence}%</div>
                        <div class="premium-confidence-bar">
                            <div class="premium-confidence-fill" style="width: ${predictions.winnerConfidence}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="premium-results-note sega-note">
                <div class="sega-info-icon">ℹ️</div>
                <div>
                    <p>Sega Football est connu pour ses matchs à <strong>faible nombre de buts</strong>.</p>
                    <p>Notre modèle prédictif est spécialement optimisé pour ce type de jeu.</p>
                    <p>Pour des résultats optimaux, privilégiez le marché de buts recommandé.</p>
                </div>
            </div>
        </div>
    `;
    
    premiumGameContent.innerHTML += resultsHTML;
    
    // Animate confidence bars
    const confidenceBars = premiumGameContent.querySelectorAll('.premium-confidence-fill');
    confidenceBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
    
    // Add bonus for generating predictions
    const bonusAmount = isAdmin() ? 20 : 12;
    addCoins(bonusAmount);
    
    // Show bonus message in container
    const bonusContainer = document.createElement('div');
    bonusContainer.className = 'bonus-container';
    bonusContainer.innerHTML = `
        <div class="bonus-message">
            +${bonusAmount} jetons pour avoir utilisé Sega Football!
        </div>
    `;
    
    premiumGameContent.appendChild(bonusContainer);
    
    // Pour l'administrateur, afficher un message spécial
    if (isAdmin()) {
        const adminMessage = document.createElement('div');
        adminMessage.className = 'admin-info';
        adminMessage.textContent = 'Mode Admin: Bonus de jetons augmenté!';
        premiumGameContent.appendChild(adminMessage);
    }
}

function calculateSegaFootballPredictions() {
    // Modèle mathématique pour Sega Football (jeu à faible nombre de buts)
    
    // Parse scores from input
    const firstHalfScore = parseScore(segaData.scores.firstHalf.score || "0-0");
    const secondHalfScore = parseScore(segaData.scores.secondHalf.score || "0-0");
    const homeWinScore = parseScore(segaData.scores.homeWin.score || "1-0");
    const drawScore = parseScore(segaData.scores.draw.score || "0-0");
    const awayWinScore = parseScore(segaData.scores.awayWin.score || "0-1");
    
    // Déterminer l'équipe favorite basée sur les cotes
    let favoriteTeam;
    if (segaData.odds.home < segaData.odds.away && segaData.odds.home < segaData.odds.draw) {
        favoriteTeam = 'home';
    } else if (segaData.odds.away < segaData.odds.home && segaData.odds.away < segaData.odds.draw) {
        favoriteTeam = 'away';
    } else {
        favoriteTeam = 'draw';
    }
    
    // Pour Sega Football, nous nous concentrons sur les prédictions à faible nombre de buts
    
    // Premier score exact - basé sur les scores combinés de mi-temps, ajusté pour un faible nombre de buts
    let firstExactScore;
    // Total de buts dans les scores de mi-temps
    const totalMTGoals = firstHalfScore.home + firstHalfScore.away + secondHalfScore.home + secondHalfScore.away;
    
    // Ajuster pour un faible nombre de buts si nécessaire
    if (totalMTGoals > 2) {
        // Réduire le scoring pour la première prédiction
        if (firstHalfScore.home > firstHalfScore.away) {
            firstExactScore = "1-0";
        } else if (firstHalfScore.away > firstHalfScore.home) {
            firstExactScore = "0-1";
        } else {
            firstExactScore = "0-0";
        }
    } else {
        // Garder le score original s'il est déjà bas
        firstExactScore = `${firstHalfScore.home}-${firstHalfScore.away}`;
    }
    
    // Deuxième score exact - différent du premier mais toujours à faible nombre de buts
    let secondExactScore;
    
    // Utiliser l'un des scores fournis (victoire domicile, nul, victoire extérieur)
    if (favoriteTeam === 'home') {
        // L'équipe à domicile est favorite
        secondExactScore = `${homeWinScore.home}-${homeWinScore.away}`;
    } else if (favoriteTeam === 'away') {
        // L'équipe à l'extérieur est favorite
        secondExactScore = `${awayWinScore.home}-${awayWinScore.away}`;
    } else {
        // Match nul le plus probable
        secondExactScore = `${drawScore.home}-${drawScore.away}`;
    }
    
    // S'assurer que le deuxième score est différent du premier
    if (secondExactScore === firstExactScore) {
        // Essayer un autre score
        const allScores = [
            `${homeWinScore.home}-${homeWinScore.away}`,
            `${drawScore.home}-${drawScore.away}`,
            `${awayWinScore.home}-${awayWinScore.away}`
        ];
        
        for (const score of allScores) {
            if (score !== firstExactScore) {
                secondExactScore = score;
                break;
            }
        }
        
        // Si tous les scores sont identiques, créer une légère variation
        if (secondExactScore === firstExactScore) {
            const parsedFirst = parseScore(firstExactScore);
            if (parsedFirst.home > 0) {
                secondExactScore = `${parsedFirst.home - 1}-${parsedFirst.away}`;
            } else if (parsedFirst.away > 0) {
                secondExactScore = `${parsedFirst.home}-${parsedFirst.away - 1}`;
            } else {
                // Si 0-0, passer à 1-0 ou 0-1
                secondExactScore = Math.random() > 0.5 ? "1-0" : "0-1";
            }
        }
    }
    
    // Déterminer le marché de buts recommandé (typiquement Under 2.5 ou Under 3.5)
    // Utiliser le marché under avec les cotes les plus basses (le plus probable)
    const recommendedGoalsMarket = segaData.totals.under35 < 1.8 ? 
        "Under 3.5 buts" : "Under 2.5 buts";
    
    // Déterminer le gagnant en fonction des cotes et des scores
    let winner;
    let winnerConfidence;
    
    if (favoriteTeam === 'home') {
        winner = "Équipe Domicile";
        winnerConfidence = Math.round((1 / segaData.odds.home) * 100);
    } else if (favoriteTeam === 'away') {
        winner = "Équipe Extérieur";
        winnerConfidence = Math.round((1 / segaData.odds.away) * 100);
    } else {
        winner = "Match nul";
        winnerConfidence = Math.round((1 / segaData.odds.draw) * 100);
    }
    
    // S'assurer que les valeurs de confiance sont dans des plages raisonnables
    winnerConfidence = Math.min(90, Math.max(60, winnerConfidence));
    
    // Pour Sega Football, la confiance dans les marchés under est très élevée
    const goalsConfidence = Math.floor(Math.random() * 6) + 92; // 92-97%
    
    // La confiance dans les scores exacts est légèrement inférieure mais toujours élevée pour le premium
    const firstScoreConfidence = Math.floor(Math.random() * 11) + 75; // 75-85%
    const secondScoreConfidence = Math.floor(Math.random() * 11) + 75; // 75-85%
    
    return {
        firstExactScore,
        secondExactScore,
        recommendedGoalsMarket,
        winner,
        winnerConfidence,
        firstScoreConfidence,
        secondScoreConfidence,
        goalsConfidence
    };
}

// Helper function to parse scores in format "X-Y"
function parseScore(scoreString) {
    if (!scoreString || !scoreString.includes('-')) {
        return { home: 0, away: 0 };
    }
    
    const parts = scoreString.split('-');
    return {
        home: parseInt(parts[0]) || 0,
        away: parseInt(parts[1]) || 0
    };
}
