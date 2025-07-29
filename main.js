import { AMADEUS_API_KEY, AMADEUS_API_SECRET } from './amadeus-token.js';

let accessToken = '';

async function getAccessToken() {
  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`
  });
  const data = await res.json();
  accessToken = data.access_token;
}

// Fetch destination recommendations (this is a simplified example)
async function getRecommendations({ budget, weather, activities, travelDate, distance }) {
  await getAccessToken();

  // Sample: Replace with a real endpoint from Amadeus (e.g., points of interest, locations)
  const res = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations?keyword=CharLotte&subType=CITY`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }
  );

  const data = await res.json();
  return data.data;
}

// Handle form submit
document.getElementById('travel-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const budget = document.getElementById('budget').value;
  const weather = document.getElementById('weather').value;
  const activities = document.getElementById('activities').value;
  const travelDate = document.getElementById('travel-date').value;
  const distance = document.getElementById('distance').value;

  const preferences = { budget, weather, activities, travelDate, distance };

  document.getElementById('results').innerHTML = `<div class="progress"><div class="indeterminate"></div></div>`;

  try {
    const destinations = await getRecommendations(preferences);
    displayRecommendations(destinations);
  } catch (error) {
    document.getElementById('results').innerHTML = `<p class="red-text">Error fetching recommendations.</p>`;
    console.error(error);
  }
});

function displayRecommendations(destinations) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  destinations.forEach(dest => {
    resultsDiv.innerHTML += `
      <div class="col s12 m6">
        <div class="card blue-grey darken-1">
          <div class="card-content white-text">
            <span class="card-title">${dest.name || dest.address?.cityName || 'Destination'}</span>
            <p>Type: ${dest.subType}</p>
          </div>
        </div>
      </div>
    `;
  });
}
