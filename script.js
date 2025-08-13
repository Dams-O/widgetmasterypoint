const API_KEY = "RGAPI-20a7a950-9ca1-465a-88c7-e2938db5bc7c"; // Remplace par ta clé API
const SUMMONER_NAME = "Boromir";
const REGION = "euw1"; // Par exemple, pour l'Europe
const CHAMPION_ID = 64; // ID de Lee Sin

async function fetchMasteryPoints() {
    // Étape 1 : Récupérer le Summoner ID
    const summonerResponse = await fetch(
        `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${SUMMONER_NAME}?api_key=${API_KEY}`
    );
    const summonerData = await summonerResponse.json();
    const summonerId = summonerData.id;

    // Étape 2 : Récupérer les points de maîtrise de Lee Sin
    const masteryResponse = await fetch(
        `https://${REGION}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/by-champion/${CHAMPION_ID}?api_key=${API_KEY}`
    );
    const masteryData = await masteryResponse.json();
    const masteryPoints = masteryData.championPoints;

    // Mettre à jour la barre de progression
    updateProgressBar(masteryPoints);
}

function updateProgressBar(points) {
    const goal = 100000;
    const percentage = (points / goal) * 100;
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = `${percentage}%`;
    progressBar.innerText = `${points} / ${goal}`;
}

// Appeler la fonction toutes les heures (3600000 ms)
setInterval(fetchMasteryPoints, 3600000);

fetchMasteryPoints(); // Appel initial

