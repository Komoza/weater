import { useState, useEffect } from "react";
import "./App.css";
import moment from "moment";
import { debounce } from "lodash";

function App() {
  // State
  const [weatherData, setWeatherData] = useState(null);
  const [country, setCountry] = useState("");
  const [tips, setTips] = useState(null);
  const [modalActive, setActive] = useState(false);
  const [preloader, setPreloader] = useState(false);

  const showPreloader = () =>
    preloader && <img src="./image/preloader.gif" alt="loading" />;

  const searchComponent = () => {
    return (
      !preloader && (
        <div className="search">
          <div className="search__left">
            <h1 className="search__text">Check the weather in your city</h1>
            <div className="search-box">
              <input
                className={`search__input ${tips ? "--top-border" : ""}`}
                placeholder="Search city"
                onKeyUp={handleInputKeyUp}
              />
              {tips}
            </div>
          </div>
          <img
            className="search__image"
            src="./src/image/cloud.svg"
            alt="logo"
          />
        </div>
      )
    );
  };

  const handleOptionClick = (event) => {
    setPreloader(true);
    const lat = event.target.getAttribute("data-lat");
    const lon = event.target.getAttribute("data-lon");
    getWeather(lat, lon);
  };

  const handleInputKeyUp = debounce((event) => {
    const town = event.target.value;
    if (event.code === "Enter" && town !== "") {
      setPreloader(true)
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
    if (event.target.value.length > 0) {
      const urlTips = `http://api.openweathermap.org/geo/1.0/direct?q=${event.target.value}&limit=5&appid=cf47b4e8a7ac7b9a03be3f7e94b5d2b3`;
      fetch(urlTips)
        .then((response) => response.json())
        .then((data) => {
          const liItems = data.map((item, index) => {
            return (
              <li
                key={index}
                className="search__option"
                onClick={handleOptionClick}
                data-lat={item.lat}
                data-lon={item.lon}
              >{`${item.name} ${item.state ? "- " + item.state : ""} - ${
                item.country
              }`}</li>
            );
          });
          if (liItems.length === 0) {
            setTips(null);
          } else {
            setTips(liItems);
          }
        });
    } else {
      setTips(null);
    }
  }, 500);

  const getWeather = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cf47b4e8a7ac7b9a03be3f7e94b5d2b3`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
      });

    const geonamesURL = `http://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lon}&username=komoza`;
    fetch(geonamesURL)
      .then((response) => response.json())
      .then((dataCountry) => {
        setCountry(dataCountry.countryName);
        setActive(true);
      });
  };

  const closeModal = () => {
    setActive(false);
    setPreloader(false);
    setCountry("");
    setTips(null);
  };

  const Modal = () => {
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
      <div className="container">
        {showPreloader()}
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
