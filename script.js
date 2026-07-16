const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const errorMsg = document.getElementById('errorMsg');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    try {
        searchBtn.disabled = true;
        searchBtn.textContent = 'Searching...';

        const locationResponse = await fetch(
            `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        if (!locationResponse.ok) {
            throw new Error('Location lookup failed.');
        }

        const locationData = await locationResponse.json();
        const location = locationData.results?.[0];
        if (!location) {
            showError('City not found. Please check the name.');
            return;
        }

        const weatherResponse = await fetch(
            `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );
        if (!weatherResponse.ok) {
            throw new Error('Weather lookup failed.');
        }

        const weatherData = await weatherResponse.json();
        displayWeather(location, weatherData.current);
    } catch (error) {
        showError('Error fetching weather data. Please try again.');
    } finally {
        searchBtn.disabled = false;
        searchBtn.textContent = 'Search';
    }
}

function displayWeather(location, current) {
    errorMsg.classList.add('hidden');
    weatherInfo.classList.remove('hidden');

    document.getElementById('cityName').textContent = `${location.name}, ${location.country}`;
    document.getElementById('temperature').textContent = `Temperature: ${Math.round(current.temperature_2m)}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${current.wind_speed_10m} km/h`;
    document.getElementById('forecast').textContent = `Description: ${weatherDescription(current.weather_code)}`;
}

function weatherDescription(code) {
    const descriptions = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
        55: 'Heavy drizzle', 61: 'Light rain', 63: 'Moderate rain', 65: 'Heavy rain',
        71: 'Light snow', 73: 'Moderate snow', 75: 'Heavy snow', 80: 'Rain showers',
        81: 'Moderate rain showers', 82: 'Heavy rain showers', 95: 'Thunderstorm',
        96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] ?? 'Unknown conditions';
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
}
