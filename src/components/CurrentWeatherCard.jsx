import { WMO_DESCRIPTIONS_FR } from "../constants/wmoDescriptions";
import WmoIcon from "./WmoIcon";

const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

/** "Mardi 28 juillet 2026" */
function formatLongDate(date) {
    const label = date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
}

export default function CurrentWeatherCard({ city, current }) {
    const description = WMO_DESCRIPTIONS_FR[current.weather_code] ?? "Conditions inconnues";

    const metrics = [
        { label: "Humidité", value: `${numberFormatter.format(current.relative_humidity_2m)} %` },
        { label: "Vent", value: `${numberFormatter.format(current.wind_speed_10m)} km/h` },
        { label: "Pression", value: `${numberFormatter.format(Math.round(current.pressure_msl))} hPa` },
        { label: "Visibilité", value: `${numberFormatter.format(Math.round(current.visibility / 1000))} km` },
        { label: "Indice UV", value: numberFormatter.format(current.uv_index) },
        { label: "Précipitations", value: `${numberFormatter.format(current.precipitation)} mm` },
    ];

    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-semibold tracking-tight">
                {city.name}, {city.country}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{formatLongDate(new Date())}</p>

            <div className="mt-6 flex items-center gap-6">
                <WmoIcon
                    code={current.weather_code}
                    isDay={current.is_day}
                    title={description}
                    className="shrink-0 text-8xl text-sky-600"
                />
                <div>
                    <p className="text-5xl font-light tracking-tight">
                        {numberFormatter.format(current.temperature_2m)} °C
                    </p>
                    <p className="mt-1 font-medium text-slate-600">{description}</p>
                    <p className="text-sm text-slate-400">
                        Ressenti {numberFormatter.format(current.apparent_temperature)} °C
                    </p>
                </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl bg-slate-50 p-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {metric.label}
                        </dt>
                        <dd className="mt-1 text-lg font-medium text-slate-900">{metric.value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
