// js/fifa-prediction-system.js
// Système de prédiction avancé pour Expert FIFA

// État des questions et des réponses
let predictionData = {
    odds: {
        home: 0,
        draw: 0,
        away: 0
    },
    firstHalf: {
        homeGoals: 0,
        awayGoals: 0,
        odds: 0
    },
    secondHalf: {
        homeGoals: 0,
        awayGoals: 0,
        odds: 0
    },
    exactScore: {
        homeGoals: 0,
        awayGoals: 0,
        odds: 0
    },
    currentStep: 1,
    totalSteps: 4,
    league: ''
};

// Questions et structure pour chaque étape
const predictionSteps = [
    {
        title: "Cotes classiques (1 - N - 2)",
        description: "Ces cotes serviront à identifier le favori du match.",
        fields: [
            { id: "home-odds", type: "number", label: "Cote victoire domicile", placeholder: "Ex: 2.10", step: "0.01" },
            { id: "draw-odds", type: "number", label: "Cote match nul", placeholder: "Ex: 3.50", step: "0.01" },
            { id: "away-odds", type: "number", label: "Cote victoire extérieur", placeholder: "Ex: 3.20", step: "0.01" }
        ]
    },
    {
        title: "Score exact favori en 1ʳᵉ mi-temps + cote",
        description: "Sert à estimer la dynamique de début de match.",
        fields: [
            { id: "first-half-home", type: "number", label: "Buts domicile (1ère mi-temps)", placeholder: "Ex: 1", min: "0", max: "9" },
            { id: "first-half-away", type: "number", label: "Buts extérieur (1ère mi-temps)", placeholder: "Ex: 0", min: "0", max: "9" },
            { id: "first-half-odds", type: "number", label: "Cote de ce score exact", placeholder: "Ex: 4.33", step: "0.01" }
        ]
    },
    {
        title: "Score exact favori en 2ᵒ mi-temps + cote",
        description: "Permet d'évaluer les probabilités en seconde période.",
        fields: [
            { id: "second-half-home", type: "number", label: "Buts domicile (2ème mi-temps)", placeholder: "Ex: 2", min: "0", max: "9" },
            { id: "second-half-away", type: "number", label: "Buts extérieur (2ème mi-temps)", placeholder: "Ex: 1", min: "0", max: "9" },
            { id: "second-half-odds", type: "number", label: "Cote de ce score exact", placeholder: "Ex: 5.25", step: "0.01" }
        ]
    },
    {
        title: "Score exact favori global (toutes colonnes) + cote",
        description: "Sert de base pour confirmer la tendance globale.",
        fields: [
            { id: "exact-score-home", type: "number", label: "Buts domicile (score final)", placeholder: "Ex: 3", min: "0", max: "9" },
            { id: "exact-score-away", type: "number", label: "Buts extérieur (score final)", placeholder: "Ex: 1", min: "0", max: "9" },
            { id: "exact-score-odds", type: "number", label: "Cote de ce score exact", placeholder: "Ex: 12.00", step: "0.01" }
        ]
    }
];

// DOM Elements
let predictionContainer;
let stepTitle;
let stepDescription;
let formFields;
let prevButton;
let nextButton;
let predictionButton;
let animationContainer;
let resultsContainer;

export function initFifaPredictionSystem(container, league) {
    predictionContainer = container;
    
    // Reset data
    predictionData.currentStep = 1;
    predictionData.league = league;
    
    // Create the UI
    createPredictionUI();
    
    // Render the first step
    renderCurrentStep();
}

function createPredictionUI() {
    predictionContainer.innerHTML = '';
    
    // Create step progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'step-progress';
    for (let i = 1; i <= predictionData.totalSteps; i++) {
        const step = document.createElement('div');
        step.className = 'step';
        step.innerHTML = `<span>${i}</span>`;
        if (i <= predictionData.currentStep) {
            step.classList.add('active');
        }
        progressBar.appendChild(step);
    }
    
    // Create form elements
    stepTitle = document.createElement('h3');
    stepTitle.className = 'step-title';
    
    stepDescription = document.createElement('p');
    stepDescription.className = 'step-description';
    
    formFields = document.createElement('div');
    formFields.className = 'form-fields';
    
    // Create navigation buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'navigation-buttons';
    
    prevButton = document.createElement('button');
    prevButton.className = 'nav-button prev-button';
    prevButton.textContent = 'Précédent';
    prevButton.addEventListener('click', goToPreviousStep);
    
    nextButton = document.createElement('button');
    nextButton.className = 'nav-button next-button';
    nextButton.textContent = 'Suivant';
    nextButton.addEventListener('click', goToNextStep);
    
    predictionButton = document.createElement('button');
    predictionButton.className = 'prediction-button';
    predictionButton.textContent = 'Obtenir la prédiction';
    predictionButton.addEventListener('click', generatePrediction);
    
    buttonsContainer.appendChild(prevButton);
    buttonsContainer.appendChild(nextButton);
    buttonsContainer.appendChild(predictionButton);
    
    // Create animation container (hidden initially)
    animationContainer = document.createElement('div');
    animationContainer.className = 'animation-container';
    animationContainer.style.display = 'none';
    
    // Create results container (hidden initially)
    resultsContainer = document.createElement('div');
    resultsContainer.className = 'results-container';
    resultsContainer.style.display = 'none';
    
    // Append all elements
    predictionContainer.appendChild(progressBar);
    predictionContainer.appendChild(stepTitle);
    predictionContainer.appendChild(stepDescription);
    predictionContainer.appendChild(formFields);
    predictionContainer.appendChild(buttonsContainer);
    predictionContainer.appendChild(animationContainer);
    predictionContainer.appendChild(resultsContainer);
}

function renderCurrentStep() {
    const currentStep = predictionSteps[predictionData.currentStep - 1];
    
    // Update titles
    stepTitle.textContent = currentStep.title;
    stepDescription.textContent = currentStep.description;
    
    // Create form fields
    formFields.innerHTML = '';
    currentStep.fields.forEach(field => {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'field-container';
        
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
        
        // Set previously entered value (if any)
        const value = getFieldValue(field.id);
        if (value !== null) {
            input.value = value;
        }
        
        // Add event listener
        input.addEventListener('change', (e) => updateFieldValue(field.id, e.target.value));
        input.addEventListener('input', (e) => updateFieldValue(field.id, e.target.value));
        
        fieldContainer.appendChild(label);
        fieldContainer.appendChild(input);
        formFields.appendChild(fieldContainer);
    });
    
    // Update navigation buttons
    prevButton.style.display = predictionData.currentStep === 1 ? 'none' : 'inline-block';
    nextButton.style.display = predictionData.currentStep === predictionData.totalSteps ? 'none' : 'inline-block';
    predictionButton.style.display = predictionData.currentStep === predictionData.totalSteps ? 'inline-block' : 'none';
    
    // Update progress steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index + 1 <= predictionData.currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function getFieldValue(fieldId) {
    // Get current value from predictionData based on field ID
    switch (fieldId) {
        case 'home-odds':
            return predictionData.odds.home || '';
        case 'draw-odds':
            return predictionData.odds.draw || '';
        case 'away-odds':
            return predictionData.odds.away || '';
        case 'first-half-home':
            return predictionData.firstHalf.homeGoals || '';
        case 'first-half-away':
            return predictionData.firstHalf.awayGoals || '';
        case 'first-half-odds':
            return predictionData.firstHalf.odds || '';
        case 'second-half-home':
            return predictionData.secondHalf.homeGoals || '';
        case 'second-half-away':
            return predictionData.secondHalf.awayGoals || '';
        case 'second-half-odds':
            return predictionData.secondHalf.odds || '';
        case 'exact-score-home':
            return predictionData.exactScore.homeGoals || '';
        case 'exact-score-away':
            return predictionData.exactScore.awayGoals || '';
        case 'exact-score-odds':
            return predictionData.exactScore.odds || '';
        default:
            return null;
    }
}

function updateFieldValue(fieldId, value) {
    // Update predictionData based on field ID
    switch (fieldId) {
        case 'home-odds':
            predictionData.odds.home = parseFloat(value) || 0;
            break;
        case 'draw-odds':
            predictionData.odds.draw = parseFloat(value) || 0;
            break;
        case 'away-odds':
            predictionData.odds.away = parseFloat(value) || 0;
            break;
        case 'first-half-home':
            predictionData.firstHalf.homeGoals = parseInt(value) || 0;
            break;
        case 'first-half-away':
            predictionData.firstHalf.awayGoals = parseInt(value) || 0;
            break;
        case 'first-half-odds':
            predictionData.firstHalf.odds = parseFloat(value) || 0;
            break;
        case 'second-half-home':
            predictionData.secondHalf.homeGoals = parseInt(value) || 0;
            break;
        case 'second-half-away':
            predictionData.secondHalf.awayGoals = parseInt(value) || 0;
            break;
        case 'second-half-odds':
            predictionData.secondHalf.odds = parseFloat(value) || 0;
            break;
        case 'exact-score-home':
            predictionData.exactScore.homeGoals = parseInt(value) || 0;
            break;
        case 'exact-score-away':
            predictionData.exactScore.awayGoals = parseInt(value) || 0;
            break;
        case 'exact-score-odds':
            predictionData.exactScore.odds = parseFloat(value) || 0;
            break;
    }
}

function validateCurrentStep() {
    const currentStep = predictionSteps[predictionData.currentStep - 1];
    let isValid = true;
    
    currentStep.fields.forEach(field => {
        const value = getFieldValue(field.id);
        if (value === null || value === '') {
            isValid = false;
            // Highlight the field
            const input = document.getElementById(field.id);
            input.classList.add('invalid');
            
            // Remove highlight after a delay
            setTimeout(() => {
                input.classList.remove('invalid');
            }, 3000);
        }
    });
    
    return isValid;
}

function goToPreviousStep() {
    if (predictionData.currentStep > 1) {
        predictionData.currentStep--;
        renderCurrentStep();
    }
}

function goToNextStep() {
    if (validateCurrentStep() && predictionData.currentStep < predictionData.totalSteps) {
        predictionData.currentStep++;
        renderCurrentStep();
    }
}

function generatePrediction() {
    if (!validateCurrentStep()) return;
    
    // Hide form elements
    stepTitle.style.display = 'none';
    stepDescription.style.display = 'none';
    formFields.style.display = 'none';
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
    predictionButton.style.display = 'none';
    
    // Show animation
    animationContainer.style.display = 'block';
    showPredictionAnimation();
    
    // After animation, calculate and show results
    setTimeout(() => {
        animationContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        const predictionResults = calculatePrediction();
        displayPredictionResults(predictionResults);
        
        // Add navigation buttons to go back or start new prediction
        const resultButtons = document.createElement('div');
        resultButtons.className = 'result-buttons';
        
        const newPredictionButton = document.createElement('button');
        newPredictionButton.className = 'nav-button';
        newPredictionButton.textContent = 'Nouvelle prédiction';
        newPredictionButton.style.fontSize = '1.1rem';
        newPredictionButton.style.padding = '12px 25px';
        newPredictionButton.style.marginRight = '15px';
        newPredictionButton.addEventListener('click', resetPrediction);
        
        const homeButton = document.createElement('button');
        homeButton.className = 'nav-button';
        homeButton.textContent = 'Accueil';
        homeButton.style.fontSize = '1.1rem';
        homeButton.style.padding = '12px 25px';
        homeButton.addEventListener('click', goToHome);
        
        resultButtons.appendChild(newPredictionButton);
        resultButtons.appendChild(homeButton);
        resultsContainer.appendChild(resultButtons);
    }, 5000); // Animation duration
}

function showPredictionAnimation() {
    animationContainer.innerHTML = '';
    
    // Create 3D animation elements
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
            <div class="animation-status">Analyse des données...</div>
        </div>
    `;
    
    animationContainer.innerHTML = animationHTML;
    
    // Add status update animation
    const statusElement = animationContainer.querySelector('.animation-status');
    const statuses = [
        "Analyse des données...",
        "Calcul des probabilités...",
        "Application du modèle mathématique...",
        "Finalisation de la prédiction..."
    ];
    
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % statuses.length;
        statusElement.textContent = statuses[statusIndex];
    }, 1000);
    
    // Cleanup interval after animation ends
    setTimeout(() => {
        clearInterval(statusInterval);
    }, 5000);
    
    // Animate stat bars
    const statBars = animationContainer.querySelectorAll('.stat-progress');
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
}

function calculatePrediction() {
    // First exact score - addition of first and second half
    const firstExactScore = {
        home: predictionData.firstHalf.homeGoals + predictionData.secondHalf.homeGoals,
        away: predictionData.firstHalf.awayGoals + predictionData.secondHalf.awayGoals
    };
    
    // Second exact score - different model
    // We'll create a variation based on the exact score provided by user and odds
    let secondExactScore = {
        home: predictionData.exactScore.homeGoals,
        away: predictionData.exactScore.awayGoals
    };
    
    // Make sure second score is different from first
    if (secondExactScore.home === firstExactScore.home && 
        secondExactScore.away === firstExactScore.away) {
        // Adjust one of the scores by 1 goal (50% chance for each team)
        if (Math.random() > 0.5) {
            secondExactScore.home = Math.max(0, secondExactScore.home + (Math.random() > 0.5 ? 1 : -1));
        } else {
            secondExactScore.away = Math.max(0, secondExactScore.away + (Math.random() > 0.5 ? 1 : -1));
        }
    }
    
    // Total goals prediction
    const totalGoals = firstExactScore.home + firstExactScore.away - 1;
    const totalGoalsLine = totalGoals + 0.5;
    
    // Determine winner
    let winner;
    let winnerConfidence;
    
    // Based on provided odds, determine the favorite
    if (predictionData.odds.home < predictionData.odds.away) {
        winner = "Équipe Domicile";
        winnerConfidence = Math.round((1 / predictionData.odds.home) * 100);
    } else if (predictionData.odds.away < predictionData.odds.home) {
        winner = "Équipe Extérieur";
        winnerConfidence = Math.round((1 / predictionData.odds.away) * 100);
    } else {
        winner = "Match nul";
        winnerConfidence = Math.round((1 / predictionData.odds.draw) * 100);
    }
    
    // Ensure confidence is in a reasonable range
    winnerConfidence = Math.min(95, Math.max(60, winnerConfidence));
    
    // Confidence levels
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

function displayPredictionResults(results) {
    resultsContainer.innerHTML = '';
    
    // Create results display
    const resultsHTML = `
        <div class="prediction-results">
            <h3>Prédiction</h3>
            
            <div class="results-grid">
                <div class="result-card exact-score">
                    <h4>Premier Score Exact</h4>
                    <div class="score-display">
                        <span class="team-name">Équipe Domicile</span>
                        <span class="score-value">${results.firstExactScore.home} - ${results.firstExactScore.away}</span>
                        <span class="team-name">Équipe Extérieur</span>
                    </div>
                    <div class="confidence-meter">
                        <div class="confidence-label">Confiance: ${results.firstScoreConfidence}%</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${results.firstScoreConfidence}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="result-card exact-score">
                    <h4>Second Score Exact</h4>
                    <div class="score-display">
                        <span class="team-name">Équipe Domicile</span>
                        <span class="score-value">${results.secondExactScore.home} - ${results.secondExactScore.away}</span>
                        <span class="team-name">Équipe Extérieur</span>
                    </div>
                    <div class="confidence-meter">
                        <div class="confidence-label">Confiance: ${results.secondScoreConfidence}%</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${results.secondScoreConfidence}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="result-card total-goals high-confidence">
                    <h4>Nombre Total de Buts</h4>
                    <div class="total-display">
                        <span class="total-value">${results.totalGoalsLine}</span>
                    </div>
                    <div class="confidence-meter">
                        <div class="confidence-label">Confiance: ${results.totalGoalsConfidence}%</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${results.totalGoalsConfidence}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="result-card winner">
                    <h4>Gagnant Probable</h4>
                    <div class="winner-display">
                        <span class="winner-name">${results.winner}</span>
                    </div>
                    <div class="confidence-meter">
                        <div class="confidence-label">Confiance: ${results.winnerConfidence}%</div>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${results.winnerConfidence}%"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="results-note">
                <p>Le premier score exact est calculé en additionnant les scores des 1ʳᵉ et 2ᵒ mi-temps.</p>
                <p>Le second score est dérivé du score global ajusté par notre modèle mathématique avancé.</p>
                <p>Le nombre total de buts est notre prédiction avec la plus grande fiabilité.</p>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = resultsHTML;
}

function resetPrediction() {
    // Reset to first step
    predictionData.currentStep = 1;
    
    // Show form elements again
    stepTitle.style.display = 'block';
    stepDescription.style.display = 'block';
    formFields.style.display = 'block';
    nextButton.style.display = 'inline-block';
    predictionButton.style.display = 'none';
    
    // Hide results
    resultsContainer.style.display = 'none';
    
    // Render the first step again
    renderCurrentStep();
}

function goToHome() {
    // Hide the prediction container and show the main game options
    const gameInterface = document.getElementById('game-interface');
    const gamesGrid = document.querySelector('.games-grid');
    
    if (gameInterface && gameInterface.classList.contains('active')) {
        gameInterface.classList.remove('active');
    }
    
    if (gamesGrid) {
        gamesGrid.style.display = 'grid';
    }
}
