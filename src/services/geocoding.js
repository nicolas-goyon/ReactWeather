// Open-Meteo Geocoding API
// Documentation: https://open-meteo.com/en/docs/geocoding-api

const GEOCODING_API = {
    baseUrl: "https://geocoding-api.open-meteo.com/v1/search",

    // Parameters applied to every request
    defaultParameters: {
        language: "fr",
        count: 20,
        format: "json",
    },
};

const MAX_SUGGESTIONS = 5;

function buildGeocodingUrl(name, parameters = {}) {
    const url = new URL(GEOCODING_API.baseUrl);

    const allParameters = {
        name,
        ...GEOCODING_API.defaultParameters,
        ...parameters,
    };

    for (const [key, value] of Object.entries(allParameters)) {
        url.searchParams.set(key, value);
    }

    return url;
}

async function searchCities(name) {
    const response = await fetch(buildGeocodingUrl(name));
    if (!response.ok) {
        throw new Error(`Open-Meteo geocoding request failed (${response.status})`);
    }
    const data = await response.json();

    if (!data.results) return [];

    data.results.sort((a, b) => {
        if (a.population && b.population) return b.population - a.population;
        if (a.population) return -1;
        if (b.population) return 1;
        return 0;
    });

    return data.results.slice(0, MAX_SUGGESTIONS);
}

export { searchCities };
