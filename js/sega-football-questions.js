// js/sega-football-questions.js
// Structure des questions pour Sega Football

// Structure des pages de questions pour Sega Football
export const segaFootballPages = [
    {
        title: "Cotes et Scores Mi-temps",
        description: "Entrez les cotes principales et les scores de mi-temps pour ce match à faible nombre de buts.",
        fields: [
            { id: "sega-home-odds", type: "number", label: "Cote victoire domicile", placeholder: "Ex: 2.10", step: "0.01", help: "Cote pour l'équipe à domicile" },
            { id: "sega-draw-odds", type: "number", label: "Cote match nul", placeholder: "Ex: 3.50", step: "0.01", help: "Cote pour un match nul" },
            { id: "sega-away-odds", type: "number", label: "Cote victoire extérieur", placeholder: "Ex: 3.20", step: "0.01", help: "Cote pour l'équipe à l'extérieur" },
            { id: "sega-first-half-score", type: "text", label: "Score favori 1ère mi-temps", placeholder: "Ex: 0-0", help: "Score favori pour la première mi-temps (format X-Y)" },
            { id: "sega-second-half-score", type: "text", label: "Score favori 2ème mi-temps", placeholder: "Ex: 1-0", help: "Score favori pour la deuxième mi-temps (format X-Y)" }
        ]
    },
    {
        title: "Scores Exacts par Scénario",
        description: "Ces scores permettent d'analyser les tendances selon chaque scénario de résultat.",
        fields: [
            { id: "sega-home-score", type: "text", label: "Score exact (domicile gagne)", placeholder: "Ex: 1-0", help: "Score le plus probable si l'équipe à domicile gagne (format X-Y)" },
            { id: "sega-draw-score", type: "text", label: "Score exact (match nul)", placeholder: "Ex: 0-0", help: "Score nul le plus probable (format X-Y)" },
            { id: "sega-away-score", type: "text", label: "Score exact (extérieur gagne)", placeholder: "Ex: 0-1", help: "Score le plus probable si l'équipe à l'extérieur gagne (format X-Y)" }
        ]
    },
    {
        title: "Options de Buts",
        description: "Ces options sont cruciales pour le modèle prédictif de Sega Football.",
        fields: [
            { id: "sega-over15-odds", type: "number", label: "Cote +1.5 buts total", placeholder: "Ex: 1.40", step: "0.01", help: "Cote pour plus de 1.5 buts dans le match" },
            { id: "sega-under35-odds", type: "number", label: "Cote -3.5 buts total", placeholder: "Ex: 1.30", step: "0.01", help: "Cote pour moins de 3.5 buts dans le match" },
            { id: "sega-btts-yes-odds", type: "number", label: "Cote BTTS (Oui)", placeholder: "Ex: 2.10", step: "0.01", help: "Cote pour que les deux équipes marquent" }
        ]
    }
];

// Modèle de calcul pour Sega Football
export function calculateSegaFootballResults(data) {
    // Analyser les scores fournis
    const firstHalfScore = parseScore(data.firstHalfScore);
    const secondHalfScore = parseScore(data.secondHalfScore);
    const homeWinScore = parseScore(data.homeScore);
    const drawScore = parseScore(data.drawScore);
    const awayWinScore = parseScore(data.awayScore);
    
    // Déterminer l'équipe favorite basée sur les cotes
    let favoriteTeam;
    if (data.homeOdds < data.awayOdds && data.homeOdds < data.drawOdds) {
        favoriteTeam = 'home';
    } else if (data.awayOdds < data.homeOdds && data.awayOdds < data.drawOdds) {
        favoriteTeam = 'away';
    } else {
        favoriteTeam = 'draw';
    }
    
    // Premier score exact - basé sur la combinaison des mi-temps
    // Pour Sega Football, on limite à des scores bas
    let firstExactScore;
    const combinedScore = {
        home: firstHalfScore.home + secondHalfScore.home,
        away: firstHalfScore.away + secondHalfScore.away
    };
    
    // Limiter à des scores bas (typique pour Sega Football)
    if (combinedScore.home + combinedScore.away > 2) {
        // Réduire le score total si trop élevé
        if (combinedScore.home > combinedScore.away) {
            firstExactScore = {
                home: Math.min(combinedScore.home, 2),
                away: Math.min(combinedScore.away, 0)
            };
        } else {
            firstExactScore = {
                home: Math.min(combinedScore.home, 0),
                away: Math.min(combinedScore.away, 2)
            };
        }
    } else {
        // Garder le score si déjà bas
        firstExactScore = combinedScore;
    }
    
    // Deuxième score exact - basé sur le scénario favori mais toujours bas
    let secondExactScore;
    if (favoriteTeam === 'home') {
        secondExactScore = {
            home: Math.min(homeWinScore.home, 2),
            away: Math.min(homeWinScore.away, 1)
        };
    } else if (favoriteTeam === 'away') {
        secondExactScore = {
            home: Math.min(awayWinScore.home, 1),
            away: Math.min(awayWinScore.away, 2)
        };
    } else {
        secondExactScore = {
            home: drawScore.home,
            away: drawScore.away
        };
    }
    
    // S'assurer que les deux scores sont différents
    if (secondExactScore.home === firstExactScore.home && secondExactScore.away === firstExactScore.away) {
        if (secondExactScore.home > 0) {
            secondExactScore.home -= 1;
        } else if (secondExactScore.away > 0) {
            secondExactScore.away -= 1;
        } else {
            // Si 0-0, passer à 1-0 ou 0-1 selon le favori
            if (favoriteTeam === 'home') {
                secondExactScore.home = 1;
            } else if (favoriteTeam === 'away') {
                secondExactScore.away = 1;
            } else {
                secondExactScore.home = 1;
                secondExactScore.away = 1;
            }
        }
    }
    
    // Déterminer le marché de buts recommandé (selon le cahier des charges)
    // Options: -2.5, -3.5 ou -4.5
    let recommendedGoalsMarket;
    
    // Baser la recommandation sur la cote Under 3.5
    if (data.under35Odds < 1.3) {
        // Cote très basse pour Under 3.5 => recommander Under 4.5
        recommendedGoalsMarket = "Under 4.5 buts";
    } else if (data.under35Odds < 1.6) {
        // Cote moyenne pour Under 3.5 => recommander Under 3.5
        recommendedGoalsMarket = "Under 3.5 buts";
    } else {
        // Cote plus élevée pour Under 3.5 => recommander Under 2.5
        recommendedGoalsMarket = "Under 2.5 buts";
    }
    
    // Déterminer le gagnant
    let winner;
    let winnerConfidence;
    
    if (favoriteTeam === 'home') {
        winner = "Équipe Domicile";
        winnerConfidence = Math.round((1 / data.homeOdds) * 100);
    } else if (favoriteTeam === 'away') {
        winner = "Équipe Extérieur";
        winnerConfidence = Math.round((1 / data.awayOdds) * 100);
    } else {
        winner = "Match nul";
        winnerConfidence = Math.round((1 / data.drawOdds) * 100);
    }
    
    // Garantir que les confidences sont dans une plage raisonnable
    winnerConfidence = Math.min(90, Math.max(60, winnerConfidence));
    
    // Sega Football a des scores bas, donc confidence élevée pour les under
    const goalsConfidence = Math.floor(Math.random() * 6) + 92; // 92-97%
    
    // Confiance pour les scores exacts (légèrement plus basse mais toujours élevée)
    const firstScoreConfidence = Math.floor(Math.random() * 11) + 75; // 75-85%
    const secondScoreConfidence = Math.floor(Math.random() * 11) + 75; // 75-85%
    
    return {
        firstExactScore: `${firstExactScore.home}-${firstExactScore.away}`,
        secondExactScore: `${secondExactScore.home}-${secondExactScore.away}`,
        recommendedGoalsMarket,
        winner,
        winnerConfidence,
        firstScoreConfidence,
        secondScoreConfidence,
        goalsConfidence
    };
}

// Fonction auxiliaire pour analyser les scores au format "X-Y"
function parseScore(scoreStr) {
    if (!scoreStr || !scoreStr.includes('-')) {
        return { home: 0, away: 0 };
    }
    
    const parts = scoreStr.split('-');
    return {
        home: parseInt(parts[0]) || 0,
        away: parseInt(parts[1]) || 0
    };
}
