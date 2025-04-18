// js/user.js
// Gestion du profil utilisateur et authentification

// User data structure
let userData = {
    username: '',
    isPremium: false,
    isAdmin: false,  // Nouvelle propriété pour l'administrateur
    coins: 100,
    wins: 0
};

// Compte administrateur
const adminUsername = '@alve08';

// DOM Elements
let loginModal;
let usernameInput;
let loginButton;
let profileName;
let profileStatus;
let upgradeButton;
let vipButton;
let coinsElement;
let winsElement;

export function initUser() {
    // Initialize DOM elements
    loginModal = document.getElementById('login-modal');
    usernameInput = document.getElementById('username-input');
    loginButton = document.getElementById('login-button');
    profileName = document.getElementById('profile-name');
    profileStatus = document.getElementById('profile-status');
    upgradeButton = document.querySelector('.upgrade-button');
    vipButton = document.querySelector('.vip-button');
    coinsElement = document.getElementById('coins');
    winsElement = document.getElementById('wins');
    
    // Show login modal if no username is stored
    if (!localStorage.getItem('betscale_username')) {
        showLoginModal();
    } else {
        // Load user data from local storage
        loadUserData();
        updateProfileUI();
    }
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Login button click event
    loginButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        if (username) {
            userData.username = username;
            
            // Vérifier si c'est le compte administrateur
            if (username === adminUsername) {
                userData.isPremium = true;
                userData.isAdmin = true;
                userData.coins = 999999;
            }
            
            saveUserData();
            updateProfileUI();
            hideLoginModal();
            
            // Si c'est l'administrateur, afficher un message spécial
            if (userData.isAdmin) {
                setTimeout(() => {
                    alert('Bienvenue Administrateur! Vous avez un accès illimité à toutes les fonctionnalités premium.');
                }, 500);
            }
        } else {
            // Shake the input to indicate error
            usernameInput.classList.add('shake');
            setTimeout(() => usernameInput.classList.remove('shake'), 500);
        }
    });
    
    // Add shake animation for invalid input
    usernameInput.addEventListener('animationend', function() {
        this.classList.remove('shake');
    });
    
    // Upgrade to premium button click events
    if (upgradeButton) {
        upgradeButton.addEventListener('click', upgradeToPremium);
    }
    
    if (vipButton) {
        vipButton.addEventListener('click', upgradeToPremium);
    }
}

export function showLoginModal() {
    loginModal.classList.add('active');
    setTimeout(() => {
        usernameInput.focus();
    }, 300);
}

export function hideLoginModal() {
    loginModal.classList.remove('active');
}

export function loadUserData() {
    const savedUsername = localStorage.getItem('betscale_username');
    const savedPremium = localStorage.getItem('betscale_premium') === 'true';
    const savedAdmin = localStorage.getItem('betscale_admin') === 'true';
    const savedCoins = parseInt(localStorage.getItem('betscale_coins') || '100');
    const savedWins = parseInt(localStorage.getItem('betscale_wins') || '0');
    
    userData = {
        username: savedUsername || '',
        isPremium: savedPremium,
        isAdmin: savedAdmin,
        coins: savedCoins,
        wins: savedWins
    };
    
    // Si l'utilisateur est @alve08, s'assurer qu'il a les privilèges administrateur
    if (userData.username === adminUsername) {
        userData.isPremium = true;
        userData.isAdmin = true;
        userData.coins = Math.max(userData.coins, 999999);
        saveUserData(); // Sauvegarder les modifications
    }
}

export function saveUserData() {
    localStorage.setItem('betscale_username', userData.username);
    localStorage.setItem('betscale_premium', userData.isPremium);
    localStorage.setItem('betscale_admin', userData.isAdmin);
    localStorage.setItem('betscale_coins', userData.coins);
    localStorage.setItem('betscale_wins', userData.wins);
}

export function updateProfileUI() {
    profileName.textContent = userData.username;
    coinsElement.textContent = userData.coins.toLocaleString();
    winsElement.textContent = userData.wins;
    
    if (userData.isAdmin) {
        // Style spécial pour l'administrateur
        profileStatus.textContent = 'Administrateur';
        profileStatus.classList.remove('free', 'premium');
        profileStatus.classList.add('admin');
        profileStatus.style.background = 'linear-gradient(135deg, #FF5722, #E91E63)';
        upgradeButton.textContent = 'Accès Illimité';
        upgradeButton.disabled = true;
        upgradeButton.style.opacity = '0.7';
    } else if (userData.isPremium) {
        profileStatus.textContent = 'Plan Premium';
        profileStatus.classList.remove('free', 'admin');
        profileStatus.classList.add('premium');
        upgradeButton.textContent = 'Déjà Premium';
        upgradeButton.disabled = true;
        upgradeButton.style.opacity = '0.7';
    } else {
        profileStatus.textContent = 'Plan Gratuit';
        profileStatus.classList.remove('premium', 'admin');
        profileStatus.classList.add('free');
        upgradeButton.textContent = 'Passer Premium';
        upgradeButton.disabled = false;
        upgradeButton.style.opacity = '1';
    }
}

export function upgradeToPremium() {
    if (!userData.isPremium && !userData.isAdmin) {
        // Simulate premium upgrade
        userData.isPremium = true;
        userData.coins += 500; // Bonus for upgrading
        saveUserData();
        updateProfileUI();
        
        // Show success message
        alert('Félicitations! Vous êtes maintenant un utilisateur Premium! +500 jetons bonus ajoutés.');
        
        // Switch to VIP section to show premium games
        document.querySelector('[data-section="vip"]').click();
    }
}

export function addCoins(amount) {
    userData.coins += amount;
    saveUserData();
    updateProfileUI();
}

export function addWin() {
    userData.wins += 1;
    saveUserData();
    updateProfileUI();
}

export function getUserData() {
    return userData;
}

export function isPremium() {
    // L'administrateur a toujours accès aux fonctionnalités premium
    return userData.isPremium || userData.isAdmin;
}

// Nouvelle fonction pour vérifier si l'utilisateur est administrateur
export function isAdmin() {
    return userData.isAdmin;
}
