import { WMO_DESCRIPTIONS_FR } from "../constants/wmoDescriptions";
import { smoothPath } from "../utils/svgPath";
import WmoIcon from "./WmoIcon";

const COLUMN_WIDTH = 56;             
const CHART_HEIGHT = 140;            
const CURVE_TOP_Y = 28;              
const CURVE_BOTTOM_Y = 112;
const PRECIPITATION_BAR_MAX_HEIGHT = 70;

/** "2026-07-28T14:00" → "14 h" */
function formatHourLabel(isoTime) {
    return `${isoTime.slice(11, 13)} h`;
}

/**
 * 24-hour forecast chart.
 */
export default function HourlyForecastChart({ hourly }) {
    const { time, temperature_2m: temperatures, weather_code: weatherCodes,
        precipitation_probability: precipitationProbabilities, is_day: isDay } = hourly;

    const columnCount = time.length;
    const width = columnCount * COLUMN_WIDTH;
    const minTemperature = Math.min(...temperatures);
    const temperatureSpan = Math.max(...temperatures) - minTemperature || 1;

    const points = temperatures.map((temperature, i) => ({
        x: i * COLUMN_WIDTH + COLUMN_WIDTH / 2,
        y: CURVE_BOTTOM_Y - ((temperature - minTemperature) / temperatureSpan) * (CURVE_BOTTOM_Y - CURVE_TOP_Y),
    }));
    const curve = smoothPath(points);
    const area = `${curve} L ${points[columnCount - 1].x},${CHART_HEIGHT} L ${points[0].x},${CHART_HEIGHT} Z`;

    return (
        <div className="overflow-x-auto">
            <div style={{ width }}>
                <svg width={width} height={CHART_HEIGHT} className="block">
                    <defs>
                        <linearGradient id="temperatureFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>
                    {/* precipitation probability bars */}
                    {precipitationProbabilities.map((probability, i) => probability > 0 && (
                        <rect key={time[i]}
                            x={i * COLUMN_WIDTH + COLUMN_WIDTH / 2 - 9}
                            y={CHART_HEIGHT - (probability / 100) * PRECIPITATION_BAR_MAX_HEIGHT}
                            width={18}
                            height={(probability / 100) * PRECIPITATION_BAR_MAX_HEIGHT}
                            rx={3} fill="#38bdf8" opacity={0.3} />
                    ))}
                    {/* temperature curve */}
                    <path d={area} fill="url(#temperatureFill)" />
                    <path d={curve} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />
                    {points.map((point, i) => (
                        <g key={time[i]}>
                            <circle cx={point.x} cy={point.y} r={3} fill="#f59e0b" />
                            <text x={point.x} y={point.y - 9} textAnchor="middle"
                                fontSize={11} fontWeight={600} fill="#475569">
                                {Math.round(temperatures[i])}°
                            </text>
                        </g>
                    ))}
                </svg>
                {/* icon / precipitation / hour rows */}
                <div className="flex">
                    {time.map((isoTime, i) => (
                        <div key={isoTime} style={{ width: COLUMN_WIDTH }}
                            className="flex flex-col items-center"
                            title={WMO_DESCRIPTIONS_FR[weatherCodes[i]]}>
                            <WmoIcon code={weatherCodes[i]} isDay={isDay ? isDay[i] : true}
                                className="text-3xl text-slate-700" />
                            <span className="h-4 text-xs text-sky-600">
                                {precipitationProbabilities[i] > 0 ? `${precipitationProbabilities[i]} %` : ""}
                            </span>
                            <span className="mt-1 text-xs text-slate-500">{formatHourLabel(isoTime)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
