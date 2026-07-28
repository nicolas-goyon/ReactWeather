import { useState } from "react";
import Header from "./components/Header";
import WeatherDashboard from "./components/WeatherDashboard";

export default function App() {
    const [city, setCity] = useState(null);

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
            <Header onSearch={setCity} />
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
                <WeatherDashboard city={city} />
            </main>
            <footer className="py-6 text-center text-xs text-slate-400">
                Données météo fournies par Open-Meteo
            </footer>
        </div>
    );
}
