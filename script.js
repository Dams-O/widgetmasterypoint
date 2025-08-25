const API_KEY = 'RGAPI-92d85a71-3930-499b-9f38-65a95f131445'; // Ta clé API valide
const GAME_NAME = 'GLX Dæms'; // Partie avant le #
const TAG_LINE = 'GLX';
const REGION = 'europe'; // Région pour l'endpoint account
const LOL_REGION = 'euw1'; // Région pour l'endpoint mastery
const CHAMPION_ID = 64; // Lee Sin

async function fetchMasteryPoints() {
    try {
        // Étape 1 : Récupérer le PUUID via le Riot ID
        const accountResponse = await fetch(
            `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(GAME_NAME)}/${encodeURIComponent(TAG_LINE)}?api_key=${API_KEY}`
        );
        if (!accountResponse.ok) {
            throw new Error(`Erreur HTTP (Account): ${accountResponse.status} - ${accountResponse.statusText}`);
        }
        const accountData = await accountResponse.json();
        const puuid = accountData.puuid;
        console.log('PUUID:', puuid); // Pour déboguer

        // Étape 2 : Récupérer les points de maîtrise de Lee Sin directement avec le PUUID
        const masteryResponse = await fetch(
            `https://${LOL_REGION}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/by-champion/${CHAMPION_ID}?api_key=${API_KEY}`
        );
        if (!masteryResponse.ok) {
            throw new Error(`Erreur HTTP (Mastery): ${masteryResponse.status} - ${masteryResponse.statusText}`);
        }
        const masteryData = await masteryResponse.json();
        console.log('Mastery Data:', masteryData); // Pour déboguer
        updateProgressBar(masteryData.championPoints);
    } catch (error) {
        console.error('Erreur:', error);
        const progressBar = document.getElementById('progressBar');
        progressBar.innerText = `Erreur: ${error.message}`;
    }
}

function updateProgressBar(points) {
    const pointsforgoal = points - 45972;
    const goal = 100000;
    const percentage = Math.min((pointsforgoal / goal) * 100, 100);
    const progressBar = document.getElementById('progressBar');
    const progressText = document.querySelector('.progress-text');
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${Math.round(percentage)}% (${pointsforgoal})`;
}

setInterval(fetchMasteryPoints, 3600000); // Mise à jour toutes les heures
fetchMasteryPoints(); // Appel initial











