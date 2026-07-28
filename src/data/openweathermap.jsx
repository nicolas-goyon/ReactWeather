import { WEATHER_FORECAST_API_KEY } from "./Environment";

const OpenWeatherMapAPI_Reverse = "https://api.openweathermap.org/geo/1.0/reverse";



async function GetCityFromGeolocation(lat, lon) {
  const url = `${OpenWeatherMapAPI_Reverse}?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_FORECAST_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}            


export { GetCityFromGeolocation };