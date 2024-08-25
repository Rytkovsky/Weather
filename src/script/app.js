// вытаскиваем див где будут находится экраны
const weatherAll = document.querySelector(".all-weather");

//запрашиваем геолокацию у пользователя
navigator.geolocation.getCurrentPosition((position) => {
  const API_KEY = "f15ebb6af0d0f84fd164226e19ac5c52";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  // фетчим данные с апишки, передаем туда геопозицию пользователя по широте и долготе
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&`
  )
    .then((res) => res.json())
    .then((res) => getWeatherInfo(res))
    .catch((err) => console.log(err));
});

//шаблон первого экрана
function getWeatherInfo(data) {
  console.log(data);

  const {
    main: { temp, feels_like },
    weather: [{ description, icon }],
    name,
  } = data;
  const weatherInfo = document.createElement("div");
  weatherInfo.className = "weather-info";
  weatherInfo.innerHTML = `
              <img class = "weather-icon"src="./src/icons/${icon}.png"/>
              <h1 class="weather-title">${Math.round(temp)}℃</h1>
              <p class="weather-about">${description} in ${name}</p>
              <p class="weather-about">Feels like ${Math.round(
                feels_like
              )} ℃</p>
               <button class="change__city-button">Change city</button>
  
  `;
  //поведение кнопки для смены на второй экран
  const changeCityButton = weatherInfo.querySelector(".change__city-button");
  changeCityButton.addEventListener("click", () => getSecondScreen());

  //рендерим первый экран
  getFirstScreen(weatherInfo);

  // кнопка в хедере - возвращает на первый экран
  const headerButton = document.querySelector(".header-button");
  headerButton.addEventListener("click", () => getFirstScreen(weatherInfo));
}

//шаблон второго экрана
function changeCity() {
  const API_KEY = "f15ebb6af0d0f84fd164226e19ac5c52";
  const typeCityForm = document.createElement("form");
  typeCityForm.className = "form";
  typeCityForm.innerHTML = `
                <input class="type-city" type="text" placeholder="Type your city here"/>
                <button class="type-button">Find</button>
    `;
  //поведение формы для поиска - ищем город на погоду
  const typeCity = typeCityForm.querySelector(".type-city");
  typeCityForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    let check2 = fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${typeCity.value.trim()}&appid=${API_KEY}&units=metric&`
    )
      .then((res) => res.json())
      .then((res) => getWeatherInfo(res))
      .catch((err) => console.log(err));
    //проверка на ошибку введения города
    if (check2.cod == undefined || check2.cod == undefined) {
      getThirdScreen();
    }
    typeCity.value = "";
  });

  return typeCityForm;
}

//шаблон экрана с ошибкой
function getError() {
  const errorWrapper = document.createElement("div");
  errorWrapper.className = "error-wrapper";
  errorWrapper.innerHTML = `
              <p class="error__first-text">Ooops. Something went wrong.</p>
              <p class="error__second-text">Error info</p>
              <button class="error-button">Try again</button>
    `;
  const errorButton = errorWrapper.querySelector(".error-button");
  errorButton.addEventListener("click", () => getSecondScreen());

  return errorWrapper;
}

//отрисовка первого экрана
function getFirstScreen(info) {
  weatherAll.innerHTML = "";
  weatherAll.append(info);
}

//отрисовка второго экрана
function getSecondScreen() {
  weatherAll.innerHTML = "";
  weatherAll.append(changeCity());
}

//отрисовка третьего экрана
function getThirdScreen() {
  weatherAll.innerHTML = "";
  weatherAll.append(getError());
}
