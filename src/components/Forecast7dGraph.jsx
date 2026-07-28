import { WMOIcon } from "../data/WMO_Icons";
import { WMO_Codes_FR } from "../data/WMO_Codes";
import { smoothPath } from "./Forecast24hGraph";

const COL_W = 84;        // px per day column
const CHART_H = 190;     // svg height
const CURVE_TOP = 26;    // y of hottest point (leaves room for labels)
const CURVE_BOTTOM = 164;// y of coldest point

/** "Today" for the first day, then a short weekday name. */
function dayLabel(isoDate, index) {
    if (index === 0) return "Today";
    return new Date(isoDate).toLocaleDateString("en-US", { weekday: "short" });
}

/**
 * 7-day forecast graph: max (amber) and min (blue) temperature curves,
 * one column per day with icon, precipitation probability and day name.
 * `daily` follows the Open-Meteo daily response shape:
 * { time[], weather_code[], temperature_2m_max[], temperature_2m_min[],
 *   precipitation_probability_max[] }
 */
export default function Forecast7dGraph({ daily }) {
    if (!daily) return <p>Loading 7-day forecast...</p>;

    const { time, weather_code: codes, temperature_2m_max: maxs,
        temperature_2m_min: mins, precipitation_probability_max: precips } = daily;

    const n = time.length;
    const width = n * COL_W;
    const tMin = Math.min(...mins);
    const tMax = Math.max(...maxs);
    const span = tMax - tMin || 1;

    // Both curves share the same temperature scale.
    const toY = (t) => CURVE_BOTTOM - ((t - tMin) / span) * (CURVE_BOTTOM - CURVE_TOP);
    const toPoints = (temps) => temps.map((t, i) => ({
        x: i * COL_W + COL_W / 2,
        y: toY(t),
    }));
    const maxPoints = toPoints(maxs);
    const minPoints = toPoints(mins);

    return (
        <div className="overflow-x-auto">
            <div style={{ width }}>
                <svg width={width} height={CHART_H} className="block">
                    {/* band between the two curves */}
                    <path d={`${smoothPath(maxPoints)} L ${[...minPoints].reverse()
                        .map((p) => `${p.x},${p.y}`).join(" L ")} Z`}
                        fill="#f59e0b" opacity={0.08} />
                    {/* max temperature curve */}
                    <path d={smoothPath(maxPoints)} fill="none" stroke="#f59e0b"
                        strokeWidth={2.5} strokeLinecap="round" />
                    {maxPoints.map((pt, i) => (
                        <g key={time[i]}>
                            <circle cx={pt.x} cy={pt.y} r={3} fill="#f59e0b" />
                            <text x={pt.x} y={pt.y - 9} textAnchor="middle"
                                fontSize={12} fontWeight={600} fill="#475569">
                                {Math.round(maxs[i])}°
                            </text>
                        </g>
                    ))}
                    {/* min temperature curve */}
                    <path d={smoothPath(minPoints)} fill="none" stroke="#0ea5e9"
                        strokeWidth={2.5} strokeLinecap="round" />
                    {minPoints.map((pt, i) => (
                        <g key={time[i]}>
                            <circle cx={pt.x} cy={pt.y} r={3} fill="#0ea5e9" />
                            <text x={pt.x} y={pt.y + 17} textAnchor="middle"
                                fontSize={12} fontWeight={600} fill="#0284c7">
                                {Math.round(mins[i])}°
                            </text>
                        </g>
                    ))}
                </svg>
                {/* icon / precipitation / day rows */}
                <div className="flex">
                    {time.map((t, i) => (
                        <div key={t} style={{ width: COL_W }}
                            className="flex flex-col items-center"
                            title={WMO_Codes_FR[codes[i]]}>
                            <WMOIcon code={codes[i]} className="text-3xl text-gray-700" />
                            <span className="text-xs text-sky-600 h-4">
                                {precips[i] > 0 ? `${precips[i]}%` : ""}
                            </span>
                            <span className="text-xs text-gray-500 mt-1 font-medium">
                                {dayLabel(t, i)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
