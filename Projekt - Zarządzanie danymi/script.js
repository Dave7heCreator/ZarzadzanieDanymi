//Zmienne przechowujące elementy HMTL
const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  about = inputPart.querySelector(".about"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

let api;

//Jeśli klikniemy enter i pole nie jest puste wywołamy funkcję z wartością wprowadzoną
inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

//Geolokalizacja
locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Nie działa xD");
  }
});

//Funkcja przyjmuje miasto jako argument i ustawia zmienną api jako adres url do api z wpisanym miastem
function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pl&units=metric&appid=bd3da524fd50ad2a6328bc9f902ccf33`;
  fetchData();
}

//Pobieranie miejsca, po latitude i longitude użytkownika
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=pl&units=metric&appid=bd3da524fd50ad2a6328bc9f902ccf33`;
  //Pobieranie danych z serwera API
  fetchData();
}

//Funkcja działająca, gdy użytkownik nie udostępnił lokalizacji
function onError(error) {
  about.innerText = error.message;
  about.classList.add("error");
  alert(
    "Error! Nie udostępniłeś lokalizacji! Odśwież stronę i spróbuj ponownie!"
  );
}

//Parsowanie odpowiedzi od API + funkcja weatherDetails z wynikami od API jako argumentami
function fetchData() {
  about.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      about.innerText = "Coś poszło nie tak!";
    });
}

function weatherDetails(info) {
  if (info.cod == "404") {
    // Jeśli błędna miejscowość
    about.classList.replace("pending", "error");
    about.innerText = `${inputField.value} nie jest prawidłową nazwą miejscowości`;
  } else {
    //Pobieranie potrzebnych wartości o pogodzie z obiektu "info"
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity, pressure } = info.main;

    //Wybieranie ikony, która pasuje do pogody z API
    if (id == 800) {
      wIcon.src = "img/clear.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "img/storm.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "img/snow.png";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "img/hail.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "img/cloud2.png";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "img/rain.png";
    }

    //Przekazywanie określonych informacji o pogodzie do określonego elementu
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText =
      Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity} %`;
    weatherPart.querySelector(".pressure span").innerText = `${pressure} hPa`;
    about.classList.remove("pending", "error");
    about.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
