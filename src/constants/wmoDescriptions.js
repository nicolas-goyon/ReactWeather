/**
 * WMO weather interpretation codes (WW) — French descriptions.
 *
 * Code         Description
 * 0            Clear sky
 * 1, 2, 3      Mainly clear, partly cloudy, and overcast
 * 45, 48       Fog and depositing rime fog
 * 51, 53, 55   Drizzle: light, moderate, and dense intensity
 * 56, 57       Freezing drizzle: light and dense intensity
 * 61, 63, 65   Rain: slight, moderate and heavy intensity
 * 66, 67       Freezing rain: light and heavy intensity
 * 71, 73, 75   Snow fall: slight, moderate, and heavy intensity
 * 77           Snow grains
 * 80, 81, 82   Rain showers: slight, moderate, and violent
 * 85, 86       Snow showers: slight and heavy
 * 95           Thunderstorm: slight or moderate
 * 96, 99       Thunderstorm with slight and heavy hail
 */

const WMO_DESCRIPTIONS_FR = {
    0: "Ciel dégagé",
    1: "Principalement dégagé",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard",
    48: "Brouillard givrant",
    51: "Bruine faible",
    53: "Bruine modérée",
    55: "Bruine forte",
    56: "Bruine verglaçante faible",
    57: "Bruine verglaçante forte",
    61: "Pluie faible",
    63: "Pluie modérée",
    65: "Pluie forte",
    66: "Pluie verglaçante faible",
    67: "Pluie verglaçante forte",
    71: "Neige faible",
    73: "Neige modérée",
    75: "Neige forte",
    77: "Grains de neige",
    80: "Averses de pluie légères",
    81: "Averses de pluie modérées",
    82: "Averses de pluie violentes",
    85: "Averses de neige légères",
    86: "Averses de neige fortes",
    95: "Orage léger ou modéré",
    96: "Orage avec grêle légère",
    99: "Orage avec grêle forte",
};

export { WMO_DESCRIPTIONS_FR };
