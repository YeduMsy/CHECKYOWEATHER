const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.inputCity');
const card = document.querySelector('.weathercard');
const errorDisplay = document.querySelector('.errorMessage');
const apiKey = API_KEY;

weatherForm.addEventListener('submit', async event => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        try {
            errorDisplay.textContent = ''; 
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(error.message);
        }
    } else {
        displayError('Please enter a city!!');
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('City not found!!');
    }
    return await response.json(); 
}

function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }]
    } = data;

    errorDisplay.textContent = '';
    card.style.display = 'flex';

    card.querySelector(".cityName").textContent = city;
    card.querySelector(".temp").textContent = `${Math.round(temp)}°C`;
    card.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
    card.querySelector(".desc").textContent = description;
    
    const icon = card.querySelector('.icon');
    const emojiClass = getEmoji(id);
    const colorClass = getWeatherColorClass(id);
    icon.className = `icon bi ${emojiClass} ${colorClass}`;
    card.scrollIntoView({ behavior: 'smooth' });
}

function getEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "bi-cloud-lightning-rain-fill";
        case (weatherId >= 300 && weatherId < 400):
            return "bi-cloud-drizzle-fill";
        case (weatherId >= 500 && weatherId < 600):
            return "bi-cloud-rain-heavy-fill";
        case (weatherId >= 600 && weatherId < 700):
            return "bi-cloud-snow-fill";
        case (weatherId >= 700 && weatherId < 800):
            return "bi-cloud-haze2-fill";
        case (weatherId === 800):
            return "bi-sun-fill";
        case (weatherId > 800):
            return "bi-clouds-fill";
        default:
            return "bi-question-circle-fill";
    }
}
function getWeatherColorClass(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 600): 
            return "icon-wet";
        case (weatherId === 800): // Sun
            return "icon-sun";
        case (weatherId >= 600 && weatherId < 800): 
        case (weatherId > 800): // Clouds
        default:
            return "icon-neutral";
    }
}
function displayError(message) {
    errorDisplay.textContent = message;
    card.style.display = 'none';
}
