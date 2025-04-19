// js/god-mode-questions.js
// Structure des questions pour God Mode

// Structure des pages de questions pour God Mode
export const godModePages = [
    {
        title: "Cotes et Totaux",
        description: "Ces informations servent à calibrer le modèle prédictif avancé.",
        fields: [
            { id: "godmode-home-odds", type: "number", label: "Cote victoire domicile", placeholder: "Ex: 2.10", step: "0.01", help: "Cote pour l'équipe à domicile" },
            { id: "godmode-draw-odds", type: "number", label: "Cote match nul", placeholder: "Ex: 3.50", step: "0.01", help: "Cote pour un match nul" },
            { id: "godmode-away-odds", type: "number", label: "Cote victoire extérieur", placeholder: "Ex: 3.20", step: "0.01", help: "Cote pour l'équipe à l'extérieur" },
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

// Modèle de calcul pour God Mode
export function calculateGodModeResults(data) {
    // Analyser les scores fournis
    const homeScore = parseScore(data.homeScore);
    const awayScore = parseScore(data.awayScore);
    const firstHalfScore = parseScore(data.firstHalfScore);
    const secondHalfScore = parseScore(data.secondHalfScore);
    const drawScore = parseScore(data.drawScore);
    
    // Déterminer l'équipe favorite basée sur les cotes
    let favoriteTeam;
    if (data.homeOdds < data.awayOdds && data.homeOdds < data.drawOdds) {
        favoriteTeam = 'home';
    } else if (data.awayOdds < data.homeOdds && data.awayOdds < data.drawOdds) {
        favoriteTeam = 'away';
    } else {
        favoriteTeam = 'draw';
    }
    
    // Premier score exact - basé sur le favori et les scores de mi-temps
    let firstExactScore;
    if (favoriteTeam === 'home') {
        firstExactScore = {
            home: firstHalfScore.home + secondHalfScore.home,
            away: firstHalfScore.away + secondHalfScore.away
        };
    } else if (favoriteTeam === 'away') {
        firstExactScore = {
            home: Math.max(0, firstHalfScore.home - 1),
            away: Math.max(1, firstHalfScore.away + secondHalfScore.away)
        };
    } else {
        firstExactScore = {
            home: drawScore.home,
            away: drawScore.away
        };
    }
    
    // Deuxième score exact - différent du premier
    let secondExactScore;
    if (favoriteTeam === 'home') {
        // Utiliser le score favori de l'équipe à domicile avec une petite variation
        secondExactScore = {
            home: homeScore.home,
            away: homeScore.away
        };
        
        // S'assurer qu'il est différent du premier
        if (secondExactScore.home === firstExactScore.home && secondExactScore.away === firstExactScore.away) {
            if (Math.random() > 0.5) {
                secondExactScore.home = Math.max(0, secondExactScore.home + (Math.random() > 0.5 ? 1 : -1));
            } else {
                secondExactScore.away = Math.max(0, secondExactScore.away + (Math.random() > 0.5 ? 1 : -1));
            }
        }
    } else if (favoriteTeam === 'away') {
        // Utiliser le score favori de l'équipe à l'extérieur
        secondExactScore = {
            home: awayScore.home,
            away: awayScore.away
        };
        
        // S'assurer qu'il est différent du premier
        if (secondExactScore.home === firstExactScore.home && secondExactScore.away === firstExactScore.away) {
            if (Math.random() > 0.5) {
                secondExactScore.home = Math.max(0, secondExactScore.home + (Math.random() > 0.5 ? 1 : -1));
            } else {
                secondExactScore.away = Math.max(0, secondExactScore.away + (Math.random() > 0.5 ? 1 : -1));
            }
        }
    } else {
        // Match nul - utiliser un autre score nul
        secondExactScore = {
            home: 1,
            away: 1
        };
        
        // S'assurer qu'il est différent du premier
        if (secondExactScore.home === firstExactScore.home && secondExactScore.away === firstExactScore.away) {
            secondExactScore = {
                home: 0,
                away: 0
            };
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
        winnerConfidence = Math.round((1 / data.homeOdds) * 100);
    } else if (favoriteTeam === 'away') {
        winner = "Équipe Extérieur";
        winnerConfidence = Math.round((1 / data.awayOdds) * 100);
    } else {
        winner = "Match nul";
        winnerConfidence = Math.round((1 / data.drawOdds) * 100);
    }
    
    // Garantir que les confidences sont dans une plage raisonnable
    winnerConfidence = Math.min(95, Math.max(60, winnerConfidence));
    
    // Indices de confiance selon le cahier des charges
    const firstScoreConfidence = Math.floor(Math.random() * 11) + 65; // 65-75%
    const secondScoreConfidence = Math.floor(Math.random() * 11) + 65; // 65-75%
    const totalGoalsConfidence = Math.floor(Math.random() * 10) + 90; // 90-99%
    
    return {
        firstExactScore: `${firstExactScore.home}-${firstExactScore.away}`,
        secondExactScore: `${secondExactScore.home}-${secondExactScore.away}`,
        totalGoalsLine,
        winner,
        winnerConfidence,
        firstScoreConfidence,
        secondScoreConfidence,
        totalGoalsConfidence
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
