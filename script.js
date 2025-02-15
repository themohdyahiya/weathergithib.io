const apiKey = "70c8521b9b00746b431fb1b45afc0ed3";
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherInfo = document.querySelector(".weather-info");
const searchCitySection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");
const dateTimeTxt = document.querySelector(".current-data-txt");
const forecastContainer = document.querySelector(".forecast-items-container");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherData(city);
        }
    }
});

async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(url),
            fetch(forecastUrl)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error("City not found");
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
    } catch (error) {
        showNotFound();
    }
}

function updateWeatherUI(data) {
    document.querySelector(".country").textContent = data.name;
    document.querySelector(".temp-txt").textContent = `${Math.round(data.main.temp)} °C`;
    document.querySelector(".condition-txt").textContent = data.weather[0].main;
    document.querySelector(".humidity-value-txt").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind-value-txt").textContent = `${data.wind.speed} M/s`;
    
    const weatherIcon = document.querySelector(".weather-summary-img");
    weatherIcon.src = getWeatherIcon(data.weather[0].main);
    
    updateDateTime();
    
    weatherInfo.style.display = "flex";
    searchCitySection.style.display = "none";
    notFoundSection.style.display = "none";
}

function updateForecastUI(data) {
    forecastContainer.innerHTML = "";
    const forecastList = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
    
    forecastList.forEach((forecast) => {
        const date = new Date(forecast.dt_txt);
        const options = { day: '2-digit', month: 'short' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-items");
        forecastItem.innerHTML = `
            <h5 class="forecast-item-date regular-txt">${formattedDate}</h5>
            <img src="${getWeatherIcon(forecast.weather[0].main)}" class="forecast-item-img">
            <h5 class="forecast-items-temp">${Math.round(forecast.main.temp)} °C</h5>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

function showNotFound() {
    weatherInfo.style.display = "none";
    searchCitySection.style.display = "none";
    notFoundSection.style.display = "flex";
}

function getWeatherIcon(condition) {
    const icons = {
        Clear: "assets/Weather/clear.svg",
        Clouds: "assets/Weather/clouds.svg",
        Rain: "assets/Weather/rain.svg",
        Thunderstorm: "assets/Weather/thunderstorm.svg",
        Snow: "assets/Weather/snow.svg",
        Atmosphere: "assets/Weather/atmosphere.svg"
    };
    return icons[condition] || "assets/Weather/clouds.svg";
}

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    dateTimeTxt.textContent = now.toLocaleString('en-US', options);
}

setInterval(updateDateTime, 1000);
updateDateTime();
