const API_KEY = 'YOUR_API_KEY_HERE';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

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
        const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            showError('City not found. Please check the name.');
            return;
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError('Error fetching weather data. Please try again.');
    }
}

function displayWeather(data) {
    errorMsg.classList.add('hidden');
    weatherInfo.classList.remove('hidden');

    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `Temperature: ${Math.round(data.main.temp)} C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
    document.getElementById('forecast').textContent = `Description: ${data.weather[0].description}`;
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
}

