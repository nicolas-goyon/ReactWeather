import { OPENWEATHERMAP_API_KEY } from "../config/environment";

const REVERSE_GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0/reverse";

async function fetchCityFromCoordinates(latitude, longitude) {
    const url = new URL(REVERSE_GEOCODING_API_URL);
    url.searchParams.set("lat", latitude);
    url.searchParams.set("lon", longitude);
    url.searchParams.set("limit", 1);
    url.searchParams.set("appid", OPENWEATHERMAP_API_KEY);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`OpenWeatherMap request failed (${response.status})`);
    }
    return await response.json();
}

export { fetchCityFromCoordinates };
