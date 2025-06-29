const apiKey = 'YOUR_API_KEY'; 

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchBtn').addEventListener('click', fetchWeather);
  document.getElementById('likeBtn').addEventListener('click', toggleLike);
});

function fetchWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert('Please enter a city name');

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => updateWeatherDisplay(data))
    .catch(error => {
      console.error('Error fetching weather:', error);
      document.getElementById('weatherDisplay').innerHTML = 'City not found.';
    });
}

function updateWeatherDisplay(data) {
  if (data.cod !== 200) {
    document.getElementById('weatherDisplay').innerHTML = 'City not found.';
    return;
  }

  const html = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;

  document.getElementById('weatherDisplay').innerHTML = html;
}

function toggleLike() {
  const btn = document.getElementById('likeBtn');
  btn.classList.toggle('liked');
  btn.textContent = btn.classList.contains('liked') ? '💔 Unlike' : '❤️ Like';
}
