const apiKey = 'e1728ee5dc8e4303bb5155756250909';
const weatherContainer = document.getElementById('weather-container');
const locationName = document.getElementById('location-name');
const loading = document.getElementById('loading');

function fetchWeather(lat, lon) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            weatherContainer.innerHTML = `<p>Failed to fetch weather data. Please try again later.</p>`;
            console.error('Error fetching weather data:', error);
        });
}

function displayWeather(data) {
    // Clear loading message
    weatherContainer.innerHTML = '';

    // Display location name
    const location = data.location;
    locationName.textContent = `${location.name}, ${location.region}`;

    data.forecast.forecastday.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');

        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        dayElement.innerHTML = `
            <h2>${dayName}</h2>
            <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>Max: ${day.day.maxtemp_c}°C</p>
            <p>Min: ${day.day.mintemp_c}°C</p>
        `;
        weatherContainer.appendChild(dayElement);
    });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(lat, lon);
            },
            () => {
                weatherContainer.innerHTML = `<p>Unable to retrieve your location. Please enable location services and refresh the page.</p>`;
            }
        );
    } else {
        weatherContainer.innerHTML = `<p>Geolocation is not supported by your browser.</p>`;
    }
}

// Get the weather on page load
getLocation();
