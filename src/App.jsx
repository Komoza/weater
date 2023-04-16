import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);

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

  const renderWeatherWindow = (weatherData) => {
    if (!weatherData) {
      return null;
    }
    return (
      <div className="weather">
        <h1 className="weather__name">{weatherData.name}</h1>
        <p>Temperature: {Math.floor(weatherData.main.temp - 273.15)}°C</p>
        <p>Humidity: {weatherData.main.humidity}%</p>
      </div>
    );
  };

  const getWeather = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=cf47b4e8a7ac7b9a03be3f7e94b5d2b3`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
      });
  };

  return (
    <div className="App">
      <div className="container">
        {searchComponent()}
        {renderWeatherWindow(weatherData)}
      </div>
    </div>
  );
}

export default App;
