// Open-Meteo Geocoding API

const GeoCodingAPI = {
    baseUrl: "https://geocoding-api.open-meteo.com/v1/search",

    // Parameters applied to every request
    mainParameters: {
        language: "fr",
        count: 20,
        format: "json",
    },
}

// Merge the searched name, the main parameters and the request-specific
// parameters into a request URL.
function BuildGeoCodingUrl(name, parameters = {}) {
    const url = new URL(GeoCodingAPI.baseUrl);

    const allParameters = {
        name: name,
        ...GeoCodingAPI.mainParameters,
        ...parameters,
    };

    for (const [key, value] of Object.entries(allParameters)) {
        url.searchParams.set(key, value);
    }

    return url;
}

async function AutoCompleteCity(city) {
    const response = await fetch(BuildGeoCodingUrl(city));
    const data = await response.json();

    // Sort results
    if (!data.results) return [];
    data.results.sort((a, b) => {
        if (a.population && b.population) {
            return b.population - a.population;
        }
        if (a.population) return -1;
        if (b.population) return 1;
        return 0;
    });

    data.results = data.results.slice(0, 5);

    return data.results;
}



export { AutoCompleteCity };
