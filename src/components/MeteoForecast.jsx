import { useState, useEffect, useImperativeHandle } from "react";
import { WeatherForecast_Current } from "../data/forecast";
import { WMO_Codes, WMO_Codes_FR } from "../data/WMO_Codes";
import { WMOIcon } from "../data/WMO_Icons";
import Forecast24hGraph from "./Forecast24hGraph";

/**
 * Mock data — same shape as the Open-Meteo hourly response
 * returned by WeatherForecast_24h (plus is_day, worth adding to the fetch).
 * Summer day: clear night, morning fog, afternoon storms, clearing evening.
 */
const MOCK_FORECAST_24H = {
    time: Array.from({ length: 24 }, (_, i) => `2026-07-28T${String(i).padStart(2, "0")}:00`),
    temperature_2m: [17.8, 17.2, 16.9, 16.5, 16.2, 16.0, 16.4, 17.6, 19.2, 20.9, 22.5, 24.0,
        25.2, 26.1, 26.8, 27.2, 26.9, 25.8, 23.9, 21.7, 20.2, 19.1, 18.4, 17.9],
    weather_code: [0, 0, 1, 2, 2, 45, 45, 1, 1, 2, 2, 3,
        3, 61, 80, 95, 96, 80, 3, 2, 1, 0, 0, 0],
    precipitation_probability: [0, 0, 0, 2, 3, 5, 5, 3, 4, 8, 12, 20,
        35, 55, 70, 85, 90, 60, 30, 15, 8, 4, 2, 0],
    is_day: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
};

export default function MeteoForecast({ ref }) {
    const [city, setCity] = useState(null);
    const [forecastCurrent, setForecastCurrent] = useState(null);
    const [forecast24h] = useState(MOCK_FORECAST_24H); // TODO: fetch WeatherForecast_24h(city)

    useImperativeHandle(ref, () => ({ updateCity: setCity }));

    useEffect(() => {



        if (!city) return;
        let cancelled = false;
        WeatherForecast_Current(city)
            .then((data) => { if (!cancelled) setForecastCurrent(data); })
            .catch((error) => console.error("Forecast fetch failed:", error));
        return () => { cancelled = true; };



    }, [city]);

    if (!city) {
        return <div>Please select a city.</div>;
    }

    return (
        <div className="flex flex-col">
            <section className="p-4 bg-blue-500 text-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Current Weather in {city.name}, {city.country}</h2>
                {forecastCurrent ? (
                    <div className="mt-2 flex items-start gap-4">
                        <WMOIcon code={forecastCurrent.current.weather_code}
                            isDay={forecastCurrent.current.is_day}
                            title={WMO_Codes_FR[forecastCurrent.current.weather_code]}
                            className="text-7xl shrink-0" />
                        <div>
                        <p>Temperature: {forecastCurrent.current.temperature_2m}°C</p>
                        <p>Weather: ({WMO_Codes_FR[forecastCurrent.current.weather_code]})</p>
                        <p>Pressure: {forecastCurrent.current.pressure_msl} hPa</p>
                        <p>Visibility: {forecastCurrent.current.visibility} m</p>
                        <p>UV Index: {forecastCurrent.current.uv_index}</p>
                        <p>Precipitation: {forecastCurrent.current.precipitation} mm</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading current weather...</p>
                )}
            </section>
            <section className="p-4 bg-white rounded-lg shadow-md mt-4">
                {/** 24-hour Weather forecast data with a graph **/}
                <h3 className="text-lg font-bold text-gray-800 mb-2">24h Forecast</h3>
                <Forecast24hGraph hourly={forecast24h} />
            </section>
            <section className="p-4 bg-white rounded-lg shadow-md mt-4">
                {/** 7-day Weather forecast data **/}
            </section>
        </div>
    );
}
