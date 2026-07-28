import { WMOIcon } from "../data/WMO_Icons";
import { WMO_Codes_FR } from "../data/WMO_Codes";

const COL_W = 56;        // px per hour column
const CHART_H = 140;     // svg height
const CURVE_TOP = 28;    // y of hottest point (leaves room for labels)
const CURVE_BOTTOM = 112;// y of coldest point
const PRECIP_MAX_H = 70; // bar height at 100% precipitation probability

/** Catmull-Rom → cubic Bézier smooth path through points. */
function smoothPath(pts) {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
    }
    return d;
}

/**
 * 24h forecast graph. `hourly` follows the Open-Meteo hourly response shape:
 * { time[], temperature_2m[], weather_code[], precipitation_probability[], is_day[] }
 */
export default function Forecast24hGraph({ hourly }) {
    if (!hourly) return <p>Loading 24h forecast...</p>;

    const { time, temperature_2m: temps, weather_code: codes,
        precipitation_probability: precips, is_day: isDay } = hourly;

    const n = time.length;
    const width = n * COL_W;
    const tMin = Math.min(...temps);
    const tMax = Math.max(...temps);
    const span = tMax - tMin || 1;

    const points = temps.map((t, i) => ({
        x: i * COL_W + COL_W / 2,
        y: CURVE_BOTTOM - ((t - tMin) / span) * (CURVE_BOTTOM - CURVE_TOP),
    }));
    const curve = smoothPath(points);
    const area = `${curve} L ${points[n - 1].x},${CHART_H} L ${points[0].x},${CHART_H} Z`;

    return (
        <div className="overflow-x-auto">
            <div style={{ width }}>
                <svg width={width} height={CHART_H} className="block">
                    <defs>
                        <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>
                    {/* precipitation probability bars */}
                    {precips.map((p, i) => p > 0 && (
                        <rect key={time[i]}
                            x={i * COL_W + COL_W / 2 - 9}
                            y={CHART_H - (p / 100) * PRECIP_MAX_H}
                            width={18}
                            height={(p / 100) * PRECIP_MAX_H}
                            rx={3} fill="#38bdf8" opacity={0.3} />
                    ))}
                    {/* temperature curve */}
                    <path d={area} fill="url(#tempFill)" />
                    <path d={curve} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />
                    {points.map((pt, i) => (
                        <g key={time[i]}>
                            <circle cx={pt.x} cy={pt.y} r={3} fill="#f59e0b" />
                            <text x={pt.x} y={pt.y - 9} textAnchor="middle"
                                fontSize={11} fontWeight={600} fill="#475569">
                                {Math.round(temps[i])}°
                            </text>
                        </g>
                    ))}
                </svg>
                {/* icon / precipitation / hour rows */}
                <div className="flex">
                    {time.map((t, i) => (
                        <div key={t} style={{ width: COL_W }}
                            className="flex flex-col items-center"
                            title={WMO_Codes_FR[codes[i]]}>
                            <WMOIcon code={codes[i]} isDay={isDay ? isDay[i] : true}
                                className="text-3xl text-gray-700" />
                            <span className="text-xs text-sky-600 h-4">
                                {precips[i] > 0 ? `${precips[i]}%` : ""}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">{t.slice(11, 16)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
