/**
 * WMO weather codes → Weather Icons by Erik Flowers
 * (https://erikflowers.github.io/weather-icons/)
 */
import {
    WiDaySunny, WiNightClear,
    WiDaySunnyOvercast, WiNightAltPartlyCloudy,
    WiDayCloudy, WiNightAltCloudy,
    WiCloudy, WiCloud,
    WiDayFog, WiNightFog,
    WiDaySprinkle, WiNightAltSprinkle,
    WiDaySleet, WiNightAltSleet,
    WiDayRain, WiNightAltRain,
    WiDayRainMix, WiNightAltRainMix,
    WiDaySnow, WiNightAltSnow,
    WiSnowflakeCold,
    WiDayShowers, WiNightAltShowers,
    WiDayThunderstorm, WiNightAltThunderstorm,
    WiDayHail, WiNightAltHail,
} from "react-icons/wi";

const WMO_ICONS = {
    0: { day: WiDaySunny, night: WiNightClear },                    // Clear sky
    1: { day: WiDaySunnyOvercast, night: WiNightAltPartlyCloudy },  // Mainly clear
    2: { day: WiDayCloudy, night: WiNightAltCloudy },               // Partly cloudy
    3: { day: WiCloudy, night: WiCloudy },                          // Overcast
    45: { day: WiDayFog, night: WiNightFog },                       // Fog
    48: { day: WiDayFog, night: WiNightFog },                       // Depositing rime fog
    51: { day: WiDaySprinkle, night: WiNightAltSprinkle },          // Drizzle: light
    53: { day: WiDaySprinkle, night: WiNightAltSprinkle },          // Drizzle: moderate
    55: { day: WiDaySprinkle, night: WiNightAltSprinkle },          // Drizzle: dense
    56: { day: WiDaySleet, night: WiNightAltSleet },                // Freezing drizzle: light
    57: { day: WiDaySleet, night: WiNightAltSleet },                // Freezing drizzle: dense
    61: { day: WiDayRain, night: WiNightAltRain },                  // Rain: slight
    63: { day: WiDayRain, night: WiNightAltRain },                  // Rain: moderate
    65: { day: WiDayRain, night: WiNightAltRain },                  // Rain: heavy
    66: { day: WiDayRainMix, night: WiNightAltRainMix },            // Freezing rain: light
    67: { day: WiDayRainMix, night: WiNightAltRainMix },            // Freezing rain: heavy
    71: { day: WiDaySnow, night: WiNightAltSnow },                  // Snow: slight
    73: { day: WiDaySnow, night: WiNightAltSnow },                  // Snow: moderate
    75: { day: WiDaySnow, night: WiNightAltSnow },                  // Snow: heavy
    77: { day: WiSnowflakeCold, night: WiSnowflakeCold },           // Snow grains
    80: { day: WiDayShowers, night: WiNightAltShowers },            // Rain showers: slight
    81: { day: WiDayShowers, night: WiNightAltShowers },            // Rain showers: moderate
    82: { day: WiDayShowers, night: WiNightAltShowers },            // Rain showers: violent
    85: { day: WiDaySnow, night: WiNightAltSnow },                  // Snow showers: slight
    86: { day: WiDaySnow, night: WiNightAltSnow },                  // Snow showers: heavy
    95: { day: WiDayThunderstorm, night: WiNightAltThunderstorm },  // Thunderstorm
    96: { day: WiDayHail, night: WiNightAltHail },                  // Thunderstorm, slight hail
    99: { day: WiDayHail, night: WiNightAltHail },                  // Thunderstorm, heavy hail
};

function getWmoIcon(code, isDay = true) {
    const entry = WMO_ICONS[code];
    if (!entry) return WiCloud; // fallback for unknown codes
    return isDay ? entry.day : entry.night;
}

export default function WmoIcon({ code, isDay = true, ...props }) {
    const Icon = getWmoIcon(code, isDay);
    return <Icon {...props} />;
}
