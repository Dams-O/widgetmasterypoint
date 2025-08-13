const API_KEY = 'RGAPI-1b3f7486-9aef-4f10-bedb-1b2c79d328ba'; // Clé temporaire pour tests
const GAME_NAME = 'GLX Dæms'; // Partie avant le #
const TAG_LINE = 'GLX'; // Partie après le #, par exemple EUW
const REGION = 'europe'; // Région pour l'endpoint account (europe, americas, asia)
const LOL_REGION = 'euw1'; // Région pour l'endpoint summoner/mastery
const CHAMPION_ID = 64; // Lee Sin

async function fetchMasteryPoints() {
    try {
        // Étape 1 : Récupérer le PUUID via le Riot ID
        const accountResponse = await fetch(
            `https://${REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(GAME_NAME)}/${encodeURIComponent(TAG_LINE)}?api_key=${API_KEY}`
        );
        if (!accountResponse.ok) {
            throw new Error(`Erreur HTTP (Account): ${accountResponse.status}`);
        }
        const accountData = await accountResponse.json();
        const puuid = accountData.puuid;

        // Étape 2 : Récupérer le Summoner ID via le PUUID
        const summonerResponse = await fetch(
            `https://${LOL_REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`
        );
        if (!summonerResponse.ok) {
            throw new Error(`Erreur HTTP (Summoner): ${summonerResponse.status}`);
        }
        const summonerData = await summonerResponse.json();
        const summonerId = summonerData.id;

        // Étape 3 : Récupérer les points de maîtrise de Lee Sin
        const masteryResponse = await fetch(
            `https://${LOL_REGION}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/by-champion/${CHAMPION_ID}?api_key=${API_KEY}`
        );
        if (!masteryResponse.ok) {
            throw new Error(`Erreur HTTP (Mastery): ${masteryResponse.status}`);
        }
        const masteryData = await masteryResponse.json();
        updateProgressBar(masteryData.championPoints);
    } catch (error) {
        console.error('Erreur:', error);
        const progressBar = document.getElementById('progressBar');
        progressBar.innerText = 'Erreur de connexion';
    }
}

function updateProgressBar(points) {
    const goal = 100000;
    const percentage = Math.min((points / goal) * 100, 100);
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${percentage}%`;
    progressBar.innerText = `${points} / ${goal}`;
}

setInterval(fetchMasteryPoints, 3600000); // Mise à jour toutes les heures
fetchMasteryPoints(); // Appel initial
