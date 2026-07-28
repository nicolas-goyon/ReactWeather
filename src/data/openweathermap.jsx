import { WEATHER_FORECAST_API_KEY } from "./Environment";

const OpenWeatherMapAPI_OneCall = "https://api.openweathermap.org/data/4.0/onecall";
const OpenWeatherMapAPI_Reverse = "https://api.openweathermap.org/geo/1.0/reverse";


function GetWeatherForecast(city) {
const url = `${OpenWeatherMapAPI_OneCall}?lat=${city.lat}&lon=${city.lon}&units=metric&lang=en&appid=${WEATHER_FORECAST_API_KEY}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => data);
}

async function GetCityFromGeolocation(lat, lon) {
  const url = `${OpenWeatherMapAPI_Reverse}?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_FORECAST_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}            


export { GetWeatherForecast, GetCityFromGeolocation };