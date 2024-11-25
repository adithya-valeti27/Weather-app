import React, { useState, useRef } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const inputRef = useRef();

  // const allIcons = {
  //   '1000': clear_icon,
  //   '1003': cloud_icon,
  //   '1006': cloud_icon,
  //   '1009': drizzle_icon,
  //   '1030': drizzle_icon,
  //   '1063': drizzle_icon,
  //   '1183': rain_icon,
  //   '1189': rain_icon,
  //   '1195': rain_icon,
  //   '1276': rain_icon,
  //   '1210': snow_icon,
  //   '1135': snow_icon,
  // };

  const getWeatherClass = (conditionCode) => {
    if (conditionCode >= 1000 && conditionCode <= 1003) return 'clear';
    if (conditionCode >= 1006 && conditionCode <= 1009) return 'cloudy';
    if (conditionCode >= 1063 && conditionCode <= 1276) return 'rainy';
    if (conditionCode >= 1210 && conditionCode <= 1135) return 'snowy';
    return 'sunny';
  };

  const weatherQuotes = {
    Sunny: ['Sunshine is the best medicine'],
    Rainy: ['Let the rain wash away all the pain of yesterday'],
    Cloudy: ['Every cloud has a silver lining'],
    Stormy: ['Storms make trees take deeper roots'],
    Snowy: ['Kindness is like snow—it beautifies everything it covers'],
    Windy: ['Kites rise highest against the wind, not with it.'],
    Overcast: ['Every cloud has a silver lining'],
    Mist: ['Kindness is like snow—it beautifies everything it covers'],
    Fog: ['Fog is nature\'s way of showing that not all mysteries need to be solved.'],
  };

  async function search(city) {
    const trimmedCity = city.trim();

    if (trimmedCity === '') {
      setError('Please enter a city name');
      setWeatherData(null);
      alert('Please Enter a city name');
      return;
    }

    try {
      const url = `http://api.weatherapi.com/v1/current.json?key=cb511d02283040a397c113418242511&q=${trimmedCity}&aqi=no`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      console.log(data.current.condition.icon)
      

      if (response.ok) {
        const localTime = new Date(data.location.localtime);
        const formattedTime = localTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
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
          country: data.location.country
        });
      } else {
        setError('City not found');
        setWeatherData(null);
      }
    } catch (error) {
      console.error('Error Fetching weather data', error);
      setError('Error fetching weather data');
      setWeatherData(null);
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      search(inputRef.current.value);
    }
  };

  const handleClick = () => {
    search(inputRef.current.value);
  };

  return (
    <div className={`weather ${weatherData ? getWeatherClass(weatherData.conditionCode) : ''}`}>
      {weatherData ? (
        <>
          <p className='quotes'>{weatherData.quote}</p>
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
          <p className='country'>{weatherData.country}</p>
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
