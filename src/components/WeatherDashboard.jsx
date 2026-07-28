import { useEffect, useState } from "react";
import { WiDaySunny } from "react-icons/wi";
import { fetchCurrentWeather, fetchDailyForecast, fetchHourlyForecast } from "../services/forecast";
import CurrentWeatherCard from "./CurrentWeatherCard";
import DailyForecastChart from "./DailyForecastChart";
import HourlyForecastChart from "./HourlyForecastChart";

function LoadingIndicator({ label }) {
    return (
        <div className="flex items-center gap-3 py-4 text-sm text-slate-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" aria-hidden="true" />
            {label}
        </div>
    );
}

function ForecastSection({ title, children }) {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-4 text-base font-semibold text-slate-900">{title}</h3>
            {children}
        </section>
    );
}

/** Fetches and displays the current conditions and forecasts for a city. */
export default function WeatherDashboard({ city }) {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState(null);
    const [dailyForecast, setDailyForecast] = useState(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!city) return;
        let cancelled = false;

        setCurrentWeather(null);
        setHourlyForecast(null);
        setDailyForecast(null);
        setHasError(false);

        Promise.all([fetchCurrentWeather(city), fetchHourlyForecast(city), fetchDailyForecast(city)])
            .then(([current, hourly, daily]) => {
                if (cancelled) return;
                setCurrentWeather(current);
                setHourlyForecast(hourly);
                setDailyForecast(daily);
            })
            .catch((error) => {
                console.error("Weather fetch failed:", error);
                if (!cancelled) setHasError(true);
            });

        return () => { cancelled = true; };
    }, [city]);

    if (!city) {
        return (
            <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-slate-200">
                <WiDaySunny className="text-7xl text-amber-500" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold">Bienvenue sur Météo</h2>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                    Recherchez une ville ou utilisez votre position pour consulter
                    la météo actuelle et les prévisions.
                </p>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-700 ring-1 ring-red-200">
                Impossible de récupérer les données météo pour {city.name}.
                Veuillez réessayer plus tard.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {currentWeather ? (
                <CurrentWeatherCard city={city} current={currentWeather.current} />
            ) : (
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <LoadingIndicator label="Chargement de la météo actuelle…" />
                </section>
            )}
            <ForecastSection title="Prévisions sur 24 heures">
                {hourlyForecast ? (
                    <HourlyForecastChart hourly={hourlyForecast.hourly} />
                ) : (
                    <LoadingIndicator label="Chargement des prévisions horaires…" />
                )}
            </ForecastSection>
            <ForecastSection title="Prévisions sur 7 jours">
                {dailyForecast ? (
                    <DailyForecastChart daily={dailyForecast.daily} />
                ) : (
                    <LoadingIndicator label="Chargement des prévisions quotidiennes…" />
                )}
            </ForecastSection>
        </div>
    );
}
