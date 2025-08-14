const API_KEY = 'RGAPI-1b3f7486-9aef-4f10-bedb-1b2c79d328ba'; // Ta clé API valide
const GAME_NAME = 'GLX Dæms'; // Partie avant le #
const TAG_LINE = 'GLX';
const REGION = 'europe'; // Région pour l'endpoint account
const LOL_REGION = 'euw1'; // Région pour les endpoints LoL
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

        // Étape 2 : Récupérer le Summoner ID via le PUUID
        const summonerResponse = await fetch(
            `https://${LOL_REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`
        );
        if (!summonerResponse.ok) {
            throw new Error(`Erreur HTTP (Summoner): ${summonerResponse.status} - ${summonerResponse.statusText}`);
        }
        const summonerData = await summonerResponse.json();
        console.log('Summoner Data:', summonerData); // Pour voir la réponse complète
        const summonerId = summonerData.id;
        if (!summonerId) {
            throw new Error('Summoner ID non trouvé dans la réponse');
        }

        // Étape 3 : Récupérer les points de maîtrise de Lee Sin
        const masteryResponse = await fetch(
            `https://${LOL_REGION}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/by-champion/${CHAMPION_ID}?api_key=${API_KEY}`
        );
        if (!masteryResponse.ok) {
            throw new Error(`Erreur HTTP (Mastery): ${masteryResponse.status} - ${masteryResponse.statusText}`);
        }
        const masteryData = await masteryResponse.json();
        updateProgressBar(masteryData.championPoints);
    } catch (error) {
        console.error('Erreur:', error);
        const progressBar = document.getElementById('progressBar');
        progressBar.innerText = `Erreur: ${error.message}`;
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

