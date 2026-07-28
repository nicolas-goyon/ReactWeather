/**
 * Code	Description
 * 0	Clear sky
 * 1, 2, 3	Mainly clear, partly cloudy, and overcast
 * 45, 48	Fog and depositing rime fog
 * 51, 53, 55	Drizzle: Light, moderate, and dense intensity
 * 56, 57	Freezing Drizzle: Light and dense intensity
 * 61, 63, 65	Rain: Slight, moderate and heavy intensity
 * 66, 67	Freezing Rain: Light and heavy intensity
 * 71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
 * 77	Snow grains
 * 80, 81, 82	Rain showers: Slight, moderate, and violent
 * 85, 86	Snow showers slight and heavy
 * 95 *	Thunderstorm: Slight or moderate
 * 96, 99 *	Thunderstorm with slight and heavy hail
 */

const WMO_Codes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light intensity",
    53: "Drizzle: Moderate intensity",
    55: "Drizzle: Dense intensity",
    56: "Freezing Drizzle: Light intensity",
    57: "Freezing Drizzle: Dense intensity",
    61: "Rain: Slight intensity",
    63: "Rain: Moderate intensity",
    65: "Rain: Heavy intensity",
    66: "Freezing Rain: Light intensity",
    67: "Freezing Rain: Heavy intensity",
    71: "Snow fall: Slight intensity",
    73: "Snow fall: Moderate intensity",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers: Slight",
    86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};

const WMO_Codes_Reverse = Object.fromEntries(Object.entries(WMO_Codes).map(([key, value]) => [value, parseInt(key)]));

const WMO_Codes_FR = {
    0: "Ciel dégagé",
    1: "Principalement dégagé",
    2: "Partiellement nuageux",
    3: "Couvert",
    45: "Brouillard",
    48: "Brouillard givrant",
    51: "Bruine : Intensité faible",
    53: "Bruine : Intensité modérée",
    55: "Bruine : Intensité forte",
    56: "Bruine verglaçante : Intensité faible",
    57: "Bruine verglaçante : Intensité forte",
    61: "Pluie : Intensité faible",
    63: "Pluie : Intensité modérée",
    65: "Pluie : Intensité forte",
    66: "Pluie verglaçante : Intensité faible",
    67: "Pluie verglaçante : Intensité forte",
    71: "Neige : Intensité faible",
    73: "Neige : Intensité modérée",
    75: "Neige : Intensité forte",
    77: "Grains de neige",
    80: "Averses de pluie : Légères",
    81: "Averses de pluie : Modérées",
    82: "Averses de pluie : Violentes",
    85: "Averses de neige : Légères",
    86: "Averses de neige : Fortes",
    95: "Orage : Léger ou modéré",
    96: "Orage avec grêle légère",
    99: "Orage avec grêle forte"
};

export { WMO_Codes, WMO_Codes_Reverse, WMO_Codes_FR };