import React, { useState, useRef } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import humidity_icon from "../assets/humidity.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const inputRef = useRef();

  const getWeatherClass = (dayorNight) => {
    const hour = parseInt(dayorNight, 10);
    if (hour >= 6 && hour < 18) return "day";
    if (hour >= 18 || hour < 6) return "night";
    return "day";
  };

  const weatherQuotes = {
    Sunny: ["Sunshine is the best medicine"],
    Rainy: ["Let the rain wash away all the pain of yesterday"],
    Cloudy: ["Every cloud has a silver lining"],
    Stormy: ["Storms make trees take deeper roots"],
    Snowy: ["Kindness is like snow—it beautifies everything it covers"],
    Windy: ["Kites rise highest against the wind, not with it."],
    Overcast: ["Every cloud has a silver lining"],
    Mist: ["Kindness is like snow—it beautifies everything it covers"],
    Fog: [
      "Fog is natures way of showing that not all mysteries need to be solved.",
    ],
  };

  async function search(city) {
    const trimmedCity = city.trim();

    if (trimmedCity === "") {
      setError("Please enter a city name");
      setWeatherData(null);
      alert("Please Enter a city name");
      return;
    }

    try {
      const url = `http://api.weatherapi.com/v1/current.json?key=ea1fd87f39da42c79eb55953242611&q=${trimmedCity}&aqi=no`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      console.log(data.current.condition.icon);
      console.log(data.location.localtime.slice(10, 13));

      if (response.ok) {
        const localTime = new Date(data.location.localtime);
        const formattedTime = localTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        const iconUrl = data.current.condition.icon;

        setError(null);
        setWeatherData({
          location: data.location.name,
          temperature: data.current.temp_c,
          humidity: data.current.humidity,
          wind_speed: data.current.wind_kph,
          time: formattedTime,
          conditionCode: data.current.condition.code,
          quote: weatherQuotes[data.current.condition.text],
          icon: iconUrl,
          country: data.location.country,
          dayorNight: data.location.localtime.slice(10, 14),
        });
      } else {
        setError("City not found");
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error Fetching weather data", error);
      setError("Error fetching weather data");
      setWeatherData(null);
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      search(inputRef.current.value);
    }
  };

  const handleClick = () => {
    search(inputRef.current.value);
  };

  return (
    <div
      className={`weather ${
        weatherData ? getWeatherClass(weatherData.dayorNight) : ""
      }`}
    >
      {weatherData ? (
        <>
          <p className="quotes">{weatherData.quote}</p>
        </>
      ) : null}
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search city"
          onKeyDown={handleKeyDown}
        />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {weatherData ? (
        <>
          <p className="location">{weatherData.time}</p>
          <img
            src={weatherData.icon}
            alt="Weather Icon"
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temperature}ºC</p>
          <p className="location">{weatherData.location}</p>
          <p className="country">{weatherData.country}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <p>{weatherData.humidity}%</p>
              <span>Humidity</span>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind" />
              <p>{weatherData.wind_speed} km/h</p>
              <span>Wind speed</span>
            </div>
          </div>
        </>
      ) : (
        !error && <p className="loading-message">Enter to get started</p>
      )}
    </div>
  );
};

export default Weather;
