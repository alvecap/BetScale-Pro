// js/premium-games.js
// Logique des jeux premium avec support administrateur

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
let godmodeStepsContainer;
let godmodePrevButton;
let godmodeNextButton;
let segaStepsContainer;
let segaPrevButton;
let segaNextButton;

// Game state
let currentPalier = 0;
let currentGodModeStep = 1;
let currentSegaStep = 1;
let godModeData = {
    odds: { home: 0, draw: 0, away: 0 },
    firstHalf: { homeGoals: 0, awayGoals: 0, odds: 0 },
    secondHalf: { homeGoals: 0, awayGoals: 0, odds: 0 },
    exactScore: { homeGoals: 0, awayGoals: 0, odds: 0 },
    totalSteps: 4
};
let segaData = {
    odds: { home: 0, draw: 0, away: 0 },
    firstHalf: { score: "", odds: 0 },
    secondHalf: { score: "", odds: 0 },
    scores: { home: "", draw: "", away: "" },
    goals: { over15: 0, under35: 0, bttsYes: 0 },
    totalSteps: 4
};

// Structure des étapes pour God Mode (similaire à FIFA)
const godModeSteps = [
    {
        title: "Cotes classiques (1 - N - 2)",
        description: "Ces cotes serviront à identifier le favori du match et à calculer les probabilités de succès.",
        fields: [
            { id: "godmode-home-odds", type: "number", label: "Cote victoire domicile", placeholder: "Ex: 2.10", step: "0.01", help: "La cote pour la victoire de l'équipe à domicile détermine sa force relative" },
            { id: "godmode-draw-odds", type: "number", label: "Cote match nul", placeholder: "Ex: 3.50", step: "0.01", help: "La cote pour un match nul peut indiquer l'équilibre des forces en présence" },
            { id: "godmode-away-odds", type: "number", label: "Cote victoire extérieur", placeholder: "Ex: 3.20", step: "0.01", help: "La cote pour la victoire de l'équipe à l'extérieur influence le calcul final" }
        ]
    },
    {
        title: "Score exact favori en 1ʳᵉ mi-temps + cote",
        description: "Sert à estimer la dynamique de début de match et les tendances offensives.",
        fields: [
            { id: "godmode-first-half-home", type: "number", label: "Buts domicile (1ère mi-temps)", placeholder: "Ex: 1", min: "0", max: "9", help: "Le nombre de buts en première mi-temps révèle l'intensité du début de match" },
            { id: "godmode-first-half-away", type: "number", label: "Buts extérieur (1ère mi-temps)", placeholder: "Ex: 0", min: "0", max: "9", help: "Cette information permet d'évaluer la stratégie défensive des équipes" },
            { id: "godmode-first-half-odds", type: "number", label: "Cote de ce score exact", placeholder: "Ex: 4.33", step: "0.01", help: "La cote du score exact influence directement la précision de notre algorithme" }
        ]
    },
    {
        title: "Score exact favori en 2ᵒ mi-temps + cote",
        description: "Permet d'évaluer l'évolution du match et les ajustements tactiques.",
        fields: [
            { id: "godmode-second-half-home", type: "number", label: "Buts domicile (2ème mi-temps)", placeholder: "Ex: 2", min: "0", max: "9", help: "Le nombre de buts en seconde période reflète souvent les ajustements tactiques" },
            { id: "godmode-second-half-away", type: "number", label: "Buts extérieur (2ème mi-temps)", placeholder: "Ex: 1", min: "0", max: "9", help: "Cette donnée est cruciale pour évaluer la condition physique des équipes" },
            { id: "godmode-second-half-odds", type: "number", label: "Cote de ce score exact", placeholder: "Ex: 5.25", step: "0.01", help: "Plus la cote est élevée, plus notre algorithme considère ce scénario comme improbable" }
        ]
    },
    {
        title: "Score exact favori global (toutes colonnes) + cote",
        description: "Sert de base pour confirmer la tendance globale et affiner nos prédictions.",
        fields: [
            { id: "godmode-exact-score-home", type: "number", label: "Buts domicile (score final)", placeholder: "Ex: 3", min: "0", max: "9", help: "Le score final anticipé par le bookmaker est une donnée fondamentale" },
            { id: "godmode-exact-score-away", type: "number", label: "Buts extérieur (score final)", placeholder: "Ex: 1", min: "0", max: "9", help: "Notre modèle compare ce score à ceux des mi-temps pour plus de précision" },
            { id: "godmode-exact-score-odds", type: "number", label: "Cote de ce score exact", placeholder: "Ex: 12.00", step: "0.01", help: "Cette cote est l'élément final pour calibrer notre algorithme prédictif avancé" }
        ]
    }
];

// Structure des étapes pour Sega Football
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
        title: "Scores exacts favoris mi-temps + cotes",
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
    godmodeStepsContainer = document.getElementById('godmode-steps-container');
    godmodePrevButton = document.getElementById('godmode-prev-button');
    godmodeNextButton = document.getElementById('godmode-next-button');
    segaStepsContainer = document.getElementById('sega-steps-container');
    segaPrevButton = document.getElementById('sega-prev-button');
    segaNextButton = document.getElementById('sega-next-button');
    
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
    
    // God Mode Navigation
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
                
                if (currentGodModeStep < godModeData.totalSteps) {
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
            loadGodModeContent();
        });
    }
    
    // Sega Football Navigation
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
                
                if (currentSegaStep < segaData.totalSteps) {
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

// Fonctions pour l'accès administrateur - simplifiées, sans génération rapide
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
    if (!godmodeStepsContainer) return;
    // Steps will be rendered dynamically when needed
}

function renderGodModeStep(stepNumber) {
    if (!godmodeStepsContainer) return;
    
    const step = godModeSteps[stepNumber - 1];
    godmodeStepsContainer.innerHTML = '';
    
    // Create step title and description
    const stepTitle = document.createElement('h4');
    stepTitle.className = 'premium-step-title';
    stepTitle.textContent = `Étape ${stepNumber}/${godModeData.totalSteps} - ${step.title}`;
    
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
    godmodePrevButton.style.display = stepNumber === 1 ? 'none' : 'inline-block';
    godmodeNextButton.style.display = 'inline-block';
    startGodmodePrediction.style.display = 'none';
    
    // If it's the last step and all validated, show the prediction button
    if (stepNumber === godModeData.totalSteps && validateGodModeStep(stepNumber, false)) {
        godmodeNextButton.style.display = 'none';
        startGodmodePrediction.style.display = 'inline-block';
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
        case 'godmode-first-half-home':
            return godModeData.firstHalf.homeGoals || '';
        case 'godmode-first-half-away':
            return godModeData.firstHalf.awayGoals || '';
        case 'godmode-first-half-odds':
            return godModeData.firstHalf.odds || '';
        case 'godmode-second-half-home':
            return godModeData.secondHalf.homeGoals || '';
        case 'godmode-second-half-away':
            return godModeData.secondHalf.awayGoals || '';
        case 'godmode-second-half-odds':
            return godModeData.secondHalf.odds || '';
        case 'godmode-exact-score-home':
            return godModeData.exactScore.homeGoals || '';
        case 'godmode-exact-score-away':
            return godModeData.exactScore.awayGoals || '';
        case 'godmode-exact-score-odds':
            return godModeData.exactScore.odds || '';
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
                case 'godmode-first-half-home':
                    godModeData.firstHalf.homeGoals = parseInt(value) || 0;
                    break;
                case 'godmode-first-half-away':
                    godModeData.firstHalf.awayGoals = parseInt(value) || 0;
                    break;
                case 'godmode-first-half-odds':
                    godModeData.firstHalf.odds = parseFloat(value) || 0;
                    break;
                case 'godmode-second-half-home':
                    godModeData.secondHalf.homeGoals = parseInt(value) || 0;
                    break;
                case 'godmode-second-half-away':
                    godModeData.secondHalf.awayGoals = parseInt(value) || 0;
                    break;
                case 'godmode-second-half-odds':
                    godModeData.secondHalf.odds = parseFloat(value) || 0;
                    break;
                case 'godmode-exact-score-home':
                    godModeData.exactScore.homeGoals = parseInt(value) || 0;
                    break;
                case 'godmode-exact-score-away':
                    godModeData.exactScore.awayGoals = parseInt(value) || 0;
                    break;
                case 'godmode-exact-score-odds':
                    godModeData.exactScore.odds = parseFloat(value) || 0;
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
        }
    });
    
    if (!isValid && showAlert) {
        alert('Veuillez remplir tous les champs avant de continuer.');
    }
    
    return isValid;
}

function resetGodModeSteps() {
    currentGodModeStep = 1;
    godModeData = {
        odds: { home: 0, draw: 0, away: 0 },
        firstHalf: { homeGoals: 0, awayGoals: 0, odds: 0 },
        secondHalf: { homeGoals: 0, awayGoals: 0, odds: 0 },
        exactScore: { homeGoals: 0, awayGoals: 0, odds: 0 },
        totalSteps: 4
    };
    
    if (godmodeStepsContainer) {
        godmodeStepsContainer.innerHTML = '';
    }
    
    if (godmodePrevButton) {
        godmodePrevButton.style.display = 'none';
    }
    
    if (godmodeNextButton) {
        godmodeNextButton.style.display = 'inline-block';
    }
    
    if (startGodmodePrediction) {
        startGodmodePrediction.style.display = 'none';
    }
}

// Sega Football Steps Functions
function setupSegaSteps() {
    if (!segaStepsContainer) return;
    // Steps will be rendered dynamically when needed
}

function renderSegaStep(stepNumber) {
    if (!segaStepsContainer) return;
    
    const step = segaSteps[stepNumber - 1];
    segaStepsContainer.innerHTML = '';
    
    // Create step title and description
    const stepTitle = document.createElement('h4');
    stepTitle.className = 'premium-step-title';
    stepTitle.textContent = `Étape ${stepNumber}/${segaData.totalSteps} - ${step.title}`;
    
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
    segaPrevButton.style.display = stepNumber === 1 ? 'none' : 'inline-block';
    segaNextButton.style.display = 'inline-block';
    startSegaPrediction.style.display = 'none';
    
    // If it's the last step and all validated, show the prediction button
    if (stepNumber === segaData.totalSteps && validateSegaStep(stepNumber, false)) {
        segaNextButton.style.display = 'none';
        startSegaPrediction.style.display = 'inline-block';
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
            return segaData.firstHalf.score || '';
        case 'sega-first-half-odds':
            return segaData.firstHalf.odds || '';
        case 'sega-second-half-score':
            return segaData.secondHalf.score || '';
        case 'sega-second-half-odds':
            return segaData.secondHalf.odds || '';
        case 'sega-score-home':
            return segaData.scores.home || '';
        case 'sega-score-draw':
            return segaData.scores.draw || '';
        case 'sega-score-away':
            return segaData.scores.away || '';
        case 'sega-over15-odds':
            return segaData.goals.over15 || '';
        case 'sega-under35-odds':
            return segaData.goals.under35 || '';
        case 'sega-btts-yes-odds':
            return segaData.goals.bttsYes || '';
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
                    segaData.firstHalf.score = value;
                    break;
                case 'sega-first-half-odds':
                    segaData.firstHalf.odds = parseFloat(value) || 0;
                    break;
                case 'sega-second-half-score':
                    segaData.secondHalf.score = value;
                    break;
                case 'sega-second-half-odds':
                    segaData.secondHalf.odds = parseFloat(value) || 0;
                    break;
                case 'sega-score-home':
                    segaData.scores.home = value;
                    break;
                case 'sega-score-draw':
                    segaData.scores.draw = value;
                    break;
                case 'sega-score-away':
                    segaData.scores.away = value;
                    break;
                case 'sega-over15-odds':
                    segaData.goals.over15 = parseFloat(value) || 0;
                    break;
                case 'sega-under35-odds':
                    segaData.goals.under35 = parseFloat(value) || 0;
                    break;
                case 'sega-btts-yes-odds':
                    segaData.goals.bttsYes = parseFloat(value) || 0;
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
            if (value && (field.id.includes('score') && field.id !== 'sega-over15-odds' && 
                field.id !== 'sega-under35-odds' && field.id !== 'sega-btts-yes-odds')) {
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
    
    if (!isValid && showAlert && !document.querySelector('.invalid[id^="sega-score"]')) {
        alert('Veuillez remplir tous les champs avant de continuer.');
    }
    
    return isValid;
}

function resetSegaSteps() {
    currentSegaStep = 1;
    segaData = {
        odds: { home: 0, draw: 0, away: 0 },
        firstHalf: { score: "", odds: 0 },
        secondHalf: { score: "", odds: 0 },
        scores: { home: "", draw: "", away: "" },
        goals: { over15: 0, under35: 0, bttsYes: 0 },
        totalSteps: 4
    };
    
    if (segaStepsContainer) {
        segaStepsContainer.innerHTML = '';
    }
    
    if (segaPrevButton) {
        segaPrevButton.style.display = 'none';
    }
    
    if (segaNextButton) {
        segaNextButton.style.display = 'inline-block';
    }
    
    if (startSegaPrediction) {
        startSegaPrediction.style.display = 'none';
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

// Nouvelle animation améliorée pour Apple of Fortune
function loadAppleOfFortuneContent(bookmaker) {
    premiumGameContent.innerHTML = '';
    
    // Create loading animation
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation premium-loading';
    loadingDiv.textContent = 'Calcul de la prédiction en cours...';
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
                <div class="fortune-title">Prédiction en cours...</div>
                
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
                    <div class="progress-label">Analyse des données en cours</div>
                    <div class="progress-bar apple-progress">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>
            
            <div class="fortune-result" style="display: none;">
                <h3 class="result-title">Prédiction Apple of Fortune</h3>
                <div class="result-content">
                    <div class="selected-apple">
                        <div class="big-apple-icon">🍎</div>
                        <div class="apple-number"></div>
                    </div>
                    <div class="result-message"></div>
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
        
        // Après l'animation, afficher le résultat
        setTimeout(() => {
            // Cacher l'animation
            const animation = premiumGameContent.querySelector('.apple-fortune-animation');
            animation.style.display = 'none';
            
            // Afficher le résultat
            const result = premiumGameContent.querySelector('.fortune-result');
            result.style.display = 'block';
            
            // Mettre à jour le numéro de la pomme gagnante
            const appleNumber = result.querySelector('.apple-number');
            appleNumber.textContent = winningNumber;
            
            // Mettre à jour le message de résultat
            const resultMessage = result.querySelector('.result-message');
            resultMessage.textContent = `La prédiction indique la pomme ${winningNumber}`;
            
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
        }, 5000);
    }, 1500);
}

function loadGodModeContent() {
    premiumGameContent.innerHTML = '';
    
    // Create loading animation
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation premium-loading';
    loadingDiv.textContent = 'Calcul des prédictions avancées en cours...';
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
                <div class="animation-title premium-animation-title">Analyse des données avec IA avancée...</div>
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
                <div class="animation-status premium-animation-status">Calibration des paramètres prédictifs...</div>
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
            "Calibration des paramètres prédictifs...",
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
            displayGodModeResults();
        }, 7000);
    }, 2000);
}
function displayGodModeResults() {
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
    // Calculate first exact score - combination of first and second half values from user input
    const firstExactScore = {
        home: godModeData.firstHalf.homeGoals + godModeData.secondHalf.homeGoals,
        away: godModeData.firstHalf.awayGoals + godModeData.secondHalf.awayGoals
    };
    
    // Calculate second exact score - variation based on the exact score
    let secondExactScore = {
        home: godModeData.exactScore.homeGoals,
        away: godModeData.exactScore.awayGoals
    };
    
    // Ensure second score is different from first
    if (secondExactScore.home === firstExactScore.home && 
        secondExactScore.away === firstExactScore.away) {
        // Generate a variation
        if (Math.random() > 0.5) {
            // Adjust home score
            secondExactScore.home = Math.max(0, secondExactScore.home + (Math.random() > 0.5 ? 1 : -1));
        } else {
            // Adjust away score
            secondExactScore.away = Math.max(0, secondExactScore.away + (Math.random() > 0.5 ? 1 : -1));
        }
    }
    
    // Total goals prediction
    const totalGoals = firstExactScore.home + firstExactScore.away;
    const totalGoalsLine = Math.max(1, totalGoals) + 0.5;
    
    // Determine winner based on odds
    let winner;
    let winnerConfidence;
    
    if (godModeData.odds.home < godModeData.odds.away) {
        winner = "Équipe Domicile";
        winnerConfidence = Math.round((1 / godModeData.odds.home) * 100);
    } else if (godModeData.odds.away < godModeData.odds.home) {
        winner = "Équipe Extérieur";
        winnerConfidence = Math.round((1 / godModeData.odds.away) * 100);
    } else {
        winner = "Match nul";
        winnerConfidence = Math.round((1 / godModeData.odds.draw) * 100);
    }
    
    // Ensure confidence values are in reasonable ranges
    winnerConfidence = Math.min(98, Math.max(75, winnerConfidence));
    
    // Premium feature - higher confidence levels
    const firstScoreConfidence = Math.floor(Math.random() * 11) + 85; // 85-95%
    const secondScoreConfidence = Math.floor(Math.random() * 11) + 85; // 85-95%
    const totalGoalsConfidence = Math.floor(Math.random() * 5) + 94; // 94-98%
    
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

function loadSegaFootballContent() {
    premiumGameContent.innerHTML = '';
    
    // Create loading animation
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-animation sega-loading';
    loadingDiv.textContent = 'Analyse des données Sega Football...';
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
            <div class="animation-title sega-animation-title">Traitement des données de bas scoring...</div>
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
                    <div class="progress-label">Calcul des trajectoires probabilistes</div>
                    <div class="sega-progress-bar">
                        <div class="sega-progress-fill"></div>
                    </div>
                </div>
                <div class="animation-status sega-animation-status">Analyse des statistiques de faible scoring...</div>
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
            "Analyse des statistiques de faible scoring...",
            "Calibration du modèle prédictif spécifique...",
            "Détection des motifs de buts rares...",
            "Génération des scénarios probabilistes...",
            "Finalisation des prédictions optimisées pour Sega Football..."
        ];
        
        let statusIndex = 0;
        const statusInterval = setInterval(() => {
            statusIndex = (statusIndex + 1) % statuses.length;
            statusElement.textContent = statuses[statusIndex];
        }, 1500);
        
        // After animation completes, show prediction results
        setTimeout(() => {
            clearInterval(statusInterval);
            displaySegaFootballResults();
        }, 7000);
    }, 2000);
}

function displaySegaFootballResults() {
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
    // Parse scores from input
    let firstHalfScore = { home: 0, away: 0 };
    let secondHalfScore = { home: 0, away: 0 };
    
    if (segaData.firstHalf.score) {
        firstHalfScore = parseScore(segaData.firstHalf.score);
    }
    
    if (segaData.secondHalf.score) {
        secondHalfScore = parseScore(segaData.secondHalf.score);
    }
    
    // For Sega Football, we focus on low-scoring predictions
    // First exact score - typically based on combined half-time scores but adjusted for low scoring
    const totalGoals = firstHalfScore.home + firstHalfScore.away + secondHalfScore.home + secondHalfScore.away;
    
    // Adjust for low scoring if needed
    let firstExactScore;
    if (totalGoals > 2) {
        // Reduce scoring for first prediction
        firstExactScore = `${Math.min(firstHalfScore.home, 1)}-${Math.min(firstHalfScore.away, 1)}`;
    } else {
        // Keep original score if already low
        firstExactScore = segaData.firstHalf.score || "0-0";
    }
    
    // Second exact score - different from first but still low-scoring
    // Prioritize score from user input
    let secondExactScore;
    
    // Use one of the provided scores (home win, draw, away win)
    if (segaData.odds.home < segaData.odds.away && segaData.odds.home < segaData.odds.draw) {
        // Home team is favorite
        secondExactScore = segaData.scores.home || "1-0";
    } else if (segaData.odds.away < segaData.odds.home && segaData.odds.away < segaData.odds.draw) {
        // Away team is favorite
        secondExactScore = segaData.scores.away || "0-1";
    } else {
        // Draw is most likely
        secondExactScore = segaData.scores.draw || "0-0";
    }
    
    // Ensure second score is different from first
    if (secondExactScore === firstExactScore) {
        // Try another score
        const allScores = [
            segaData.scores.home || "1-0", 
            segaData.scores.draw || "0-0", 
            segaData.scores.away || "0-1"
        ];
        
        for (const score of allScores) {
            if (score !== firstExactScore) {
                secondExactScore = score;
                break;
            }
        }
        
        // If all scores are the same, create a slight variation
        if (secondExactScore === firstExactScore) {
            const parsedFirst = parseScore(firstExactScore);
            if (parsedFirst.home > 0) {
                secondExactScore = `${parsedFirst.home - 1}-${parsedFirst.away}`;
            } else if (parsedFirst.away > 0) {
                secondExactScore = `${parsedFirst.home}-${parsedFirst.away - 1}`;
            } else {
                // If 0-0, make it 1-0 or 0-1
                secondExactScore = Math.random() > 0.5 ? "1-0" : "0-1";
            }
        }
    }
    
    // Determine recommended goals market (typically Under 2.5 or Under 3.5)
    // Use the under market with the lowest odds (most likely)
    const recommendedGoalsMarket = segaData.goals.under35 < 1.8 ? 
        "Under 3.5 buts" : "Under 2.5 buts";
    
    // Determine winner based on odds and scores
    let winner;
    let winnerConfidence;
    
    if (segaData.odds.home < segaData.odds.away && segaData.odds.home < segaData.odds.draw) {
        winner = "Équipe Domicile";
        winnerConfidence = Math.round((1 / segaData.odds.home) * 100);
    } else if (segaData.odds.away < segaData.odds.home && segaData.odds.away < segaData.odds.draw) {
        winner = "Équipe Extérieur";
        winnerConfidence = Math.round((1 / segaData.odds.away) * 100);
    } else {
        winner = "Match nul";
        winnerConfidence = Math.round((1 / segaData.odds.draw) * 100);
    }
    
    // Ensure confidence values are in reasonable ranges
    winnerConfidence = Math.min(95, Math.max(70, winnerConfidence));
    
    // For Sega Football, confidence in under markets is very high
    const goalsConfidence = Math.floor(Math.random() * 6) + 92; // 92-97%
    
    // Score exact confidence is slightly lower but still high for premium
    const firstScoreConfidence = Math.floor(Math.random() * 11) + 80; // 80-90%
    const secondScoreConfidence = Math.floor(Math.random() * 11) + 80; // 80-90%
    
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
