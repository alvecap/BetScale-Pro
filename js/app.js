// js/app.js
// Point d'entrée principal de l'application

import { initUser } from './user.js';
import { initNavigation } from './navigation.js';
import { initFreeGames } from './free-games.js';
import { initPremiumGames } from './premium-games.js';
import { initUIEffects } from './ui-effects.js';

// Importation du système de prédiction FIFA
import './fifa-prediction-system.js';

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les différentes parties de l'application
    initUser();
    initNavigation();
    initFreeGames();
    initPremiumGames();
    initUIEffects();
    
    console.log('BetScale Pro Application initialisée avec succès.');
});
