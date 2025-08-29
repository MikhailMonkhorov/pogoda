// Основные переменные
const weatherContent = document.getElementById("weather-content");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");
const cityNameElement = document.getElementById("city-name");

// Функция для поиска города
async function searchCity() {
  const city = document.getElementById("searchTitle").value.trim();

  if (!city) {
    showError("Пожалуйста, введите название города");
    return;
  }

  const API_key = "3d3068d98b1a669d7cbf1beee1b03add";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    city
  )}&appid=${API_key}&units=metric&lang=ru`;

  try {
    showLoading();
    hideError();
    hideSuccess();

    const response = await fetch(url);
    const data = await response.json();

    console.log("Ответ API:", data);

    if (data.cod === "200" || data.cod === 200) {
      showSuccess(`Погода для ${city} загружена успешно!`);
      updateWeather(data);
    } else if (data.cod === "404" || data.cod === 404) {
      showError("Город не найден. Проверьте название и попробуйте снова.");
    } else {
      showError("Ошибка сервера: " + (data.message || "Неизвестная ошибка"));
    }
  } catch (error) {
    console.error("Ошибка:", error);
    showError("Ошибка соединения: " + error.message);
  }
}

function showLoading() {
  weatherContent.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin fa-2x"></i>
                    <p>Загрузка данных о погоде...</p>
                </div>
            `;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  renderWeatherContent(); // Перерисовываем контент вместо восстановления
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);
}

function hideError() {
  errorMessage.style.display = "none";
}

function hideSuccess() {
  successMessage.style.display = "none";
}

function renderWeatherContent() {
  weatherContent.innerHTML = `
                <div class="card current-weather">
                    <div class="current-header">
                        <h3>ТЕКУЩАЯ ПОГОДА</h3>
                        <p id="current-date">--</p>
                    </div>
                    <div class="weather-main">
                        <img id="weather-icon" class="weather-icon-large" src="https://openweathermap.org/img/wn/01d@2x.png" alt="Weather Icon">
                        <div id="current-temp" class="temp-large">--°C</div>
                        <div id="weather-desc" class="weather-description">Введите город для поиска</div>
                    </div>
                    <div class="weather-details">
                        <div class="detail-item">
                            <span><i class="fas fa-temperature-high"></i> Ощущается как</span>
                            <span id="feels-like">--°C</span>
                        </div>
                        <div class="detail-item">
                            <span><i class="fas fa-wind"></i> Скорость ветра</span>
                            <span id="wind-speed">-- м/с</span>
                        </div>
                        <div class="detail-item">
                            <span><i class="fas fa-sun"></i> Восход</span>
                            <span id="sunrise-time">--:--</span>
                        </div>
                        <div class="detail-item">
                            <span><i class="fas fa-moon"></i> Закат</span>
                            <span id="sunset-time">--:--</span>
                        </div>
                    </div>
                </div>
                <div class="card hourly-forecast">
                    <h3 class="hourly-header">ПОЧАСОВОЙ ПРОГНОЗ НА СЕГОДНЯ</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Время</th>
                                <th class="hour-time">--:--</th>
                                <th class="hour-time">--:--</th>
                                <th class="hour-time">--:--</th>
                                <th class="hour-time">--:--</th>
                                <th class="hour-time">--:--</th>
                                <th class="hour-time">--:--</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Погода</td>
                                <td class="weather-icon-cell"><i class="fas fa-question"></i></td>
                                <td class="weather-icon-cell"><i class="fas fa-question"></i></td>
                                <td class="weather-icon-cell"><i class="fas fa-question"></i></td>
                                <td class="weather-icon-cell"><i class="fas fa-question"></i></td>
                                <td class="weather-icon-cell"><i class="fas fa-question"></i></td>
                                <td class="weather-icon-cell"><i class="fas fa-question"></i></td>
                            </tr>
                            <tr>
                                <td>Температура</td>
                                <td class="hour-temp">--°C</td>
                                <td class="hour-temp">--°C</td>
                                <td class="hour-temp">--°C</td>
                                <td class="hour-temp">--°C</td>
                                <td class="hour-temp">--°C</td>
                                <td class="hour-temp">--°C</td>
                            </tr>
                            <tr>
                                <td>Ощущается</td>
                                <td class="hour-feels-like">--°C</td>
                                <td class="hour-feels-like">--°C</td>
                                <td class="hour-feels-like">--°C</td>
                                <td class="hour-feels-like">--°C</td>
                                <td class="hour-feels-like">--°C</td>
                                <td class="hour-feels-like">--°C</td>
                            </tr>
                            <tr>
                                <td>Ветер</td>
                                <td class="hour-wind">-- м/с</td>
                                <td class="hour-wind">-- м/с</td>
                                <td class="hour-wind">-- м/с</td>
                                <td class="hour-wind">-- м/с</td>
                                <td class="hour-wind">-- м/с</td>
                                <td class="hour-wind">-- м/с</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
}

function updateWeather(data) {
  // Сначала перерисовываем контент
  renderWeatherContent();

  // Затем обновляем данные
  cityNameElement.textContent = `${data.city.name}, ${data.city.country}`;

  const current = data.list[0];
  document.getElementById("current-date").textContent = formatDate(
    current.dt_txt
  );
  document.getElementById("current-temp").textContent = `${Math.floor(
    current.main.temp
  )}°C`;
  document.getElementById("weather-desc").textContent =
    current.weather[0].description;
  document.getElementById("feels-like").textContent = `${Math.floor(
    current.main.feels_like
  )}°C`;
  document.getElementById("wind-speed").textContent = `${Math.floor(
    current.wind.speed
  )} м/с`;
  document.getElementById("sunrise-time").textContent = new Date(
    data.city.sunrise * 1000
  ).toLocaleTimeString();
  document.getElementById("sunset-time").textContent = new Date(
    data.city.sunset * 1000
  ).toLocaleTimeString();

  // Обновляем иконку погоды
  const weatherIconCode = current.weather[0].icon;
  document.getElementById(
    "weather-icon"
  ).src = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

  // Обновляем почасовой прогноз
  updateHourlyForecast(data);
}

function updateHourlyForecast(data) {
  const timeElements = document.querySelectorAll(".hour-time");
  const weatherIconElements = document.querySelectorAll(".weather-icon-cell");
  const tempElements = document.querySelectorAll(".hour-temp");
  const feelsLikeElements = document.querySelectorAll(".hour-feels-like");
  const windElements = document.querySelectorAll(".hour-wind");

  for (let i = 0; i < 6; i++) {
    if (i < data.list.length - 1) {
      const forecast = data.list[i + 1];

      // Время
      timeElements[i].textContent = formatTime(forecast.dt_txt);

      // Иконка погоды
      const iconCode = forecast.weather[0].icon;
      weatherIconElements[
        i
      ].innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${forecast.weather[0].description}" style="width: 30px; height: 30px;">`;

      // Температура
      tempElements[i].textContent = `${Math.floor(forecast.main.temp)}°C`;

      // Ощущается как
      feelsLikeElements[i].textContent = `${Math.floor(
        forecast.main.feels_like
      )}°C`;

      // Ветер
      windElements[i].textContent = `${Math.floor(forecast.wind.speed)} м/с`;
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("ru-RU", options);
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Добавляем возможность поиска по нажатию Enter
document
  .getElementById("searchTitle")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchCity();
    }
  });

// Инициализация при загрузке
window.onload = function () {
  document.getElementById("searchTitle").value = "Москва";
  renderWeatherContent();
};
