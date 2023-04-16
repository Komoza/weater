import { useState, useEffect } from "react";
import "./App.css";
import moment from "moment";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [country, setCountry] = useState("");
  const searchComponent = () => {
    return (
      <div className="search">
        <div className="search__left">
          <h1 className="search__text">Check the weather in your city</h1>
          <input
            className="search__input"
            placeholder="Search city"
            onKeyDown={handleInputKeyDown}
          />
        </div>
        <img className="search__image" src="./src/image/cloud.svg" alt="logo" />
      </div>
    );
  };

  const handleInputKeyDown = (event) => {
    const town = event.target.value;
    if (event.code === "Enter" && town !== "") {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${town}&limit=5&appid=cf47b4e8a7ac7b9a03be3f7e94b5d2b3`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            getWeather(lat, lon);
          }
        });
    }
  };

  const getWeather = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cf47b4e8a7ac7b9a03be3f7e94b5d2b3`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        setActive(true);
      });
    const geonamesURL = `http://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lon}&username=komoza`;

    fetch(geonamesURL)
      .then((response) => response.json())
      .then((dataCountry) => {
        setCountry(dataCountry.countryName);
      });
  };

  const [modalActive, setActive] = useState(false);
  const closeModal = () => {
    setActive(false);
    setCountry("");
  };

  const Modal = (active, setActive) => {
    if (!weatherData) {
      return null;
    }
    const now = moment();

    setTimeout(() => {
      document.querySelector(".modal").classList.add("show");
    }, 500);

    return (
      <div className="modal">
        <div className="close" onClick={closeModal}>
          <img
            className="close__image"
            src="./src/image/close.svg"
            alt="close"
          />
        </div>
        <div className="weather">
          <div className="weather__top">
            <div className="weather__date">
              <div className="weather__time">{now.format("h:mm A")}</div>
              <div className="weather__date-today">
                {now.format("dddd, D MMMM, YYYY")}
              </div>
            </div>
            <div className="weather__position">
              <div className="weather__town">{weatherData.name}</div>
              <div className="weather__country">{country}</div>
            </div>
          </div>

          <div className="weather__bot">
            <div className="weather__now">
              {Math.floor(weatherData.main.temp - 273.15)}°
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <div className={`container ${modalActive ? "blur" : ""}`}>
        {searchComponent()}
        {modalActive && (
          <Modal
            active={modalActive}
            setActive={setActive}
            weatherData={weatherData}
          />
        )}
      </div>
    </div>
  );
}

export default App;
