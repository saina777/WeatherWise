document.getElementById('weatherForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const city = document.getElementById('cityInput').value;
  getWeather(city);
});

function getWeather(city) {
  document.getElementById('loadingSpinner').style.display = 'block';
  const apiKey = "cbcedde8f910439bb47183718252906";
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(data.location.country)}?fullText=true`)
        .then(res => res.json())
        .then(countryData => {
          const flagUrl = countryData[0]?.flags?.svg || "";
          const weatherDiv = document.getElementById('weatherResult');
          weatherDiv.innerHTML = `
            <h2>
              ${data.location.name}, ${data.location.country}
              ${flagUrl ? `<img src="${flagUrl}" alt="Flag" style="width:32px;vertical-align:middle;margin-left:8px;border-radius:3px;">` : ""}
            </h2>
            <div class="weather-main">
              <img src="${data.current.condition.icon}" alt="Weather icon" class="weather-icon"/>
              <div>
                <p class="temp">${data.current.temp_c} °C</p>
                <p>${data.current.condition.text}</p>
              </div>
            </div>
            <div class="weather-details">
              <p>Feels like: ${data.current.feels_like} °C</p>
              <p>Humidity: ${data.current.humidity}%</p>
              <p>Wind: ${data.current.wind_kph} kph</p>
              <p>Pressure: ${data.current.pressure_mb} mb</p>
              <p>UV Index: ${data.current.uv}</p>
            </div>
          `;
        })
        .catch(() => {
          const weatherDiv = document.getElementById('weatherResult');
          weatherDiv.innerHTML = `
            <h2>${data.location.name}, ${data.location.country}</h2>
            <p>Temperature: ${data.current.temp_c} °C</p>
            <p>Condition: ${data.current.condition.text}</p>
            <img src="${data.current.condition.icon}" alt="Weather icon"/>
            <p>Humidity: ${data.current.humidity}%</p>
            <p>Wind: ${data.current.wind_kph} kph</p>
          `;
        });
      document.getElementById('loadingSpinner').style.display = 'none';
    })
    .catch(err => {
      document.getElementById('loadingSpinner').style.display = 'none';
      const resultDiv = document.getElementById('weatherResult');
      resultDiv.textContent = err.message;
      resultDiv.classList.add('error');
    });
}
document.getElementById('cityInput').addEventListener('input', function() {
  document.getElementById('weatherResult').textContent = '';
});
document.getElementById('favouriteBtn').addEventListener('click', function() {
  const city = document.getElementById('cityInput').value.trim();
  const likeMsg = document.getElementById('likeMsg');
  if (city) {
    let favs = getFavourites();
    if (!favs.includes(city)) {
      favs.push(city);
      setFavourites(favs);
      likeMsg.textContent = `Added ${city} to favourites!`;
      likeMsg.style.color = "#1976d2";
    } else {
      likeMsg.textContent = `${city} is already in favourites.`;
      likeMsg.style.color = "#e53935";
    }
    renderFavourites();
  } else {
    likeMsg.textContent = 'Enter a city name to favourite.';
    likeMsg.style.color = "#e53935";
  }
  setTimeout(() => { likeMsg.textContent = ""; }, 2000);
});

function getFavourites() {
  return JSON.parse(localStorage.getItem('favourites') || '[]');
}

function setFavourites(favs) {
  localStorage.setItem('favourites', JSON.stringify(favs));
}

function renderFavourites() {
  const favs = getFavourites();
  const listDiv = document.getElementById('favouritesList');
  if (favs.length === 0) {
    listDiv.innerHTML = "<em>No favourites yet.</em>";
    return;
  }
  listDiv.innerHTML = "<strong>Favourites:</strong> " + favs.map(c => `<span class="fav-city">${c}</span>`).join(", ");
}

renderFavourites();