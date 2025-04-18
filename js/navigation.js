// js/navigation.js
// Gestion de la navigation et des sections

// DOM Elements
let navButtons;
let contentSections;

export function initNavigation() {
    // Initialize DOM elements
    navButtons = document.querySelectorAll('.nav-button');
    contentSections = document.querySelectorAll('.content-section');
    
    // Correction de "Jeu" en "Jeux" dans le menu de navigation
    const jeuNavButton = document.querySelector('.nav-button[data-section="jeu"] span');
    if (jeuNavButton) {
        jeuNavButton.textContent = 'Jeux';
    }
    
    // Agrandir légèrement les boutons de navigation
    document.querySelectorAll('.nav-button .button-content').forEach(btn => {
        btn.style.width = '85%';
        btn.style.height = '85%';
    });

    document.querySelectorAll('.nav-button .icon').forEach(icon => {
        icon.style.fontSize = '1.6rem';
        icon.style.marginBottom = '8px';
    });

    document.querySelectorAll('.nav-button span').forEach(text => {
        text.style.fontSize = '0.9rem';
        text.style.fontWeight = '600';
    });
    
    // Setup navigation events
    setupNavigationEvents();
    
    // Add swipe gesture support for mobile
    setupSwipeGestures();
    
    // Initialize responsive adjustments
    adjustForScreenSize();
    window.addEventListener('resize', adjustForScreenSize);
}

function setupNavigationEvents() {
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
        });
    });
    
    // Keyboard navigation
    setupKeyboardNavigation();
}

function setupKeyboardNavigation() {
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
            const gameInterface = document.getElementById('game-interface');
            const premiumGameInterface = document.getElementById('premium-game-interface');
            
            if (gameInterface && gameInterface.classList.contains('active')) {
                const backButton = document.querySelector('.back-to-games-button');
                if (backButton) backButton.click();
            } else if (premiumGameInterface && premiumGameInterface.classList.contains('active')) {
                const homeButton = document.getElementById('premium-home-button');
                if (homeButton) homeButton.click();
            } else {
                const activeSubGame = document.querySelector('.sub-games-container.active');
                if (activeSubGame) {
                    const backButton = activeSubGame.querySelector('.back-button');
                    if (backButton) backButton.click();
                }
            }
        }
    });
}

function setupSwipeGestures() {
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
}

function adjustForScreenSize() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Adjust for mobile screens
        document.querySelectorAll('.nav-button .button-content').forEach(btn => {
            btn.style.width = '92%';
        });
    } else {
        // Adjust for larger screens
        document.querySelectorAll('.nav-button .button-content').forEach(btn => {
            btn.style.width = '85%';
        });
    }
}

// Export functions that might be needed by other modules
export function navigateToSection(sectionName) {
    const button = document.querySelector(`.nav-button[data-section="${sectionName}"]`);
    if (button) {
        button.click();
    }
}
