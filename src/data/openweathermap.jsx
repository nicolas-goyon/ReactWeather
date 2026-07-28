const OpenWeatherMapAPI = "https://api.openweathermap.org/data/4.0/onecall";


function GetWeatherForecast(city) {
  const apiKey = process.env.WEATHER_FORECAST_API_KEY;
const url = `${OpenWeatherMapAPI}?lat=${city.lat}&lon=${city.lon}&units=metric&lang=en&appid=${apiKey}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => data);
}


export { GetWeatherForecast };