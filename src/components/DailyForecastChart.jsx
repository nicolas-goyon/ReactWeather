import { WMO_DESCRIPTIONS_FR } from "../constants/wmoDescriptions";
import { smoothPath } from "../utils/svgPath";
import WmoIcon from "./WmoIcon";

const COLUMN_WIDTH = 84;   // px per day column
const CHART_HEIGHT = 190;  // svg height
const CURVE_TOP_Y = 26;    // y of hottest point (leaves room for labels)
const CURVE_BOTTOM_Y = 164;// y of coldest point

/** "Auj." for the first day, then a short French weekday name ("Mer."). */
function formatDayLabel(isoDate, index) {
    if (index === 0) return "Auj.";
    const label = new Date(isoDate).toLocaleDateString("fr-FR", { weekday: "short" });
    return label.charAt(0).toUpperCase() + label.slice(1);
}


export default function DailyForecastChart({ daily }) {
    const { time, weather_code: weatherCodes, temperature_2m_max: maxTemperatures,
        temperature_2m_min: minTemperatures,
        precipitation_probability_max: precipitationProbabilities } = daily;

    const columnCount = time.length;
    const width = columnCount * COLUMN_WIDTH;
    const minTemperature = Math.min(...minTemperatures);
    const temperatureSpan = Math.max(...maxTemperatures) - minTemperature || 1;

    // Both curves share the same temperature scale.
    const toY = (temperature) =>
        CURVE_BOTTOM_Y - ((temperature - minTemperature) / temperatureSpan) * (CURVE_BOTTOM_Y - CURVE_TOP_Y);
    const toPoints = (temperatures) => temperatures.map((temperature, i) => ({
        x: i * COLUMN_WIDTH + COLUMN_WIDTH / 2,
        y: toY(temperature),
    }));
    const maxPoints = toPoints(maxTemperatures);
    const minPoints = toPoints(minTemperatures);

    return (
        <div>
            <div className="mb-2 flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" /> Maximales
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-500" aria-hidden="true" /> Minimales
                </span>
            </div>
            <div className="overflow-x-auto">
                <div style={{ width }}>
                    <svg width={width} height={CHART_HEIGHT} className="block">
                        {/* band between the two curves */}
                        <path d={`${smoothPath(maxPoints)} L ${[...minPoints].reverse()
                            .map((point) => `${point.x},${point.y}`).join(" L ")} Z`}
                            fill="#f59e0b" opacity={0.08} />
                        {/* max temperature curve */}
                        <path d={smoothPath(maxPoints)} fill="none" stroke="#f59e0b"
                            strokeWidth={2.5} strokeLinecap="round" />
                        {maxPoints.map((point, i) => (
                            <g key={time[i]}>
                                <circle cx={point.x} cy={point.y} r={3} fill="#f59e0b" />
                                <text x={point.x} y={point.y - 9} textAnchor="middle"
                                    fontSize={12} fontWeight={600} fill="#475569">
                                    {Math.round(maxTemperatures[i])}°
                                </text>
                            </g>
                        ))}
                        {/* min temperature curve */}
                        <path d={smoothPath(minPoints)} fill="none" stroke="#0ea5e9"
                            strokeWidth={2.5} strokeLinecap="round" />
                        {minPoints.map((point, i) => (
                            <g key={time[i]}>
                                <circle cx={point.x} cy={point.y} r={3} fill="#0ea5e9" />
                                <text x={point.x} y={point.y + 17} textAnchor="middle"
                                    fontSize={12} fontWeight={600} fill="#0284c7">
                                    {Math.round(minTemperatures[i])}°
                                </text>
                            </g>
                        ))}
                    </svg>
                    {/* icon / precipitation / day rows */}
                    <div className="flex">
                        {time.map((isoDate, i) => (
                            <div key={isoDate} style={{ width: COLUMN_WIDTH }}
                                className="flex flex-col items-center"
                                title={WMO_DESCRIPTIONS_FR[weatherCodes[i]]}>
                                <WmoIcon code={weatherCodes[i]} className="text-3xl text-slate-700" />
                                <span className="h-4 text-xs text-sky-600">
                                    {precipitationProbabilities[i] > 0 ? `${precipitationProbabilities[i]} %` : ""}
                                </span>
                                <span className="mt-1 text-xs font-medium text-slate-500">
                                    {formatDayLabel(isoDate, i)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
