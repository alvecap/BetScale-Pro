// js/ui-effects.js
// Effets d'interface utilisateur

export function initUIEffects() {
    // Add 3D button effects
    add3DButtonEffects();
    
    // Add CSS for animations
    addAnimationStyles();
    
    console.log('UI Effects initialisés');
}

function add3DButtonEffects() {
    // Add hover effect to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseover', function() {
            if (!this.classList.contains('disabled')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }
        });
        
        button.addEventListener('mouseout', function() {
            if (!this.classList.contains('disabled')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
        
        button.addEventListener('mousedown', function() {
            if (!this.classList.contains('disabled')) {
                this.style.transform = 'translateY(1px)';
                this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }
        });
        
        button.addEventListener('mouseup', function() {
            if (!this.classList.contains('disabled')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }
        });
    });
}

function addAnimationStyles() {
    // Add CSS for shake animation if not already added
    if (!document.getElementById('animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
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
    }
}

// Easter egg - Konami code
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', function(e) {
    // Check if the key matches the expected key in the sequence
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        // If the entire sequence is matched
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            
            // Reset the counter
            konamiIndex = 0;
        }
    } else {
        // Reset if wrong key
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Import user module to add coins
    import('./user.js').then(userModule => {
        // Add 1000 coins as bonus
        userModule.addCoins(1000);
        
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
    });
}
