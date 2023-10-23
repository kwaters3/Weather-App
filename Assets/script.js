const API_KEY = 'cbe24cbfde821199ae30e11243bf4a34';
const cityList = document.getElementById('city-list');

// Check if there is a stored city name in localStorage
const storedCity = localStorage.getItem('city');
if (storedCity) {
    getWeatherData(storedCity);
}

document.getElementById('city-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = document.getElementById('city-input').value;
    getWeatherData(cityName);
});

cityList.addEventListener('click', function(event) {
    if (event.target.matches('li')) {
        getWeatherData(event.target.textContent);
    }
});

async function getWeatherData(cityName) {
    localStorage.setItem('city', cityName);

    try {
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);

const currentData = await currentResponse.json();
const coordinates = currentData.coord;
const lat = coordinates.lat;
const lon = coordinates.lon;
const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
const forecastData = await forecastResponse.json();

        displayWeatherData(currentData, forecastData);
        addToSearchHistory(cityName);
    } catch (error) {
        console.error('Error:', error);
    }
}



// Adds to the search history list
function addToSearchHistory(cityName) {
  const cityListItem = document.createElement('li');
  cityListItem.textContent = cityName;
  cityList.appendChild(cityListItem);
};





// function to display the weather data
function displayWeatherData(currentData, forecastData) {
  const weatherInfo = document.getElementById('weather-info');

  // Current weather information
const temperatureKelvin = currentData.main.temp;
const temperatureCelsius = temperatureKelvin - 273.15;
const temperatureFahrenheit = (temperatureCelsius * 9/5) + 32;     
    console.log('Temperature in Celsius:', temperatureCelsius);
  console.log('Temperature in Fahrenheit:', temperatureFahrenheit);
const windSpeedMetersPerSecond = currentData.wind.speed;
const windSpeedMph = windSpeedMetersPerSecond * 2.23694; // Convert wind speed to mph

  const currentWeatherHTML = `
    <div class="current-weather">
      <h2>${currentData.name}</h2>
      <p>Today</p>
      <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p> <!-- Display temperature in Fahrenheit -->
      <p>Humidity: ${currentData.main.humidity}%</p>
      <p>Wind Speed: ${windSpeedMph.toFixed(2)} mph</p> <!-- Display wind speed in mph -->
      </div> 

      `;

  // Forecast data for the next 5 days
  const forecastWeatherHTML = `
    <h3>5-Day Forecast:</h3>
      <div id="forecast-container">
          <!-- Display the weather data for the next 5 days from the forecast -->
      </div>
  `;

  weatherInfo.innerHTML = currentWeatherHTML + forecastWeatherHTML;

  // Calculate and display the weather data for the next 5 days with specific dates
  const forecastContainer = document.getElementById('forecast-container');
  const currentDate = new Date(currentData.dt * 1000);
  for (let i = 0; i < 5; i++) {
      const forecastIndex = i * 8;
      const day = forecastData.list[forecastIndex];
      const forecastDate = new Date(day.dt * 1000);
      const iconURL = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;


    const temperatureKelvinForecast = currentData.main.temp;
    const temperatureCelsiusForecast = temperatureKelvinForecast - 273.15;
    const temperatureFahrenheitForecast = (temperatureCelsiusForecast * 9/5) + 32;   
      const windSpeedMetersPerSecondForecast = day.wind.speed;
      const windSpeedMphForecast = windSpeedMetersPerSecondForecast * 2.23694;

      const forecastDayHTML = `
          <div class="forecast-card">
              <p>${i === 0 ? 'Today' : forecastDate.toDateString()}</p>
              <img src="${iconURL}" alt="${day.weather[0].description}">
              <p>Temperature: ${temperatureFahrenheitForecast.toFixed(2)}°F</p>
              <p>Humidity: ${day.main.humidity}%</p>
              <p>Wind Speed: ${windSpeedMphForecast.toFixed(2)} mph</p>
          </div>
      `;
      forecastContainer.innerHTML += forecastDayHTML;
  }
}