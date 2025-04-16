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
    
    // Play button click event
    document.querySelector('.play-button').addEventListener('click', function() {
        // Simulate adding coins
        userData.coins += 10;
        userData.wins += 1;
        saveUserData();
        updateProfileUI();
        
        // Show a quick animation
        this.textContent = '+10 Jetons!';
        this.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            this.textContent = 'Jouer';
            this.style.backgroundColor = '';
        }, 1500);
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
