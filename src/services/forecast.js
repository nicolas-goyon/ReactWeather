// Open-Meteo Weather Forecast API
// Documentation: https://open-meteo.com/en/docs

const FORECAST_API = {
    baseUrl: "https://api.open-meteo.com/v1/forecast",

    // Parameters applied to every request (see "Settings" in the docs)
    defaultParameters: {
        timezone: "auto",
        temperature_unit: "celsius",
        wind_speed_unit: "kmh",
        precipitation_unit: "mm",
    },

    // Weather variables requested for each forecast type.
    variables: {
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "weather_code",
            "wind_speed_10m",
            "pressure_msl",
            "precipitation",
            "visibility",
            "uv_index",
        ],
        hourly: [
            "temperature_2m",
            "weather_code",
            "precipitation_probability",
            "is_day",
        ],
        daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
        ],
    },
};

function buildForecastUrl(city, parameters) {
    const url = new URL(FORECAST_API.baseUrl);

    const allParameters = {
        latitude: city.latitude,
        longitude: city.longitude,
        ...FORECAST_API.defaultParameters,
        ...parameters,
    };

    for (const [name, value] of Object.entries(allParameters)) {
        url.searchParams.set(name, Array.isArray(value) ? value.join(",") : value);
    }

    return url;
}

async function requestForecast(city, parameters) {
    const response = await fetch(buildForecastUrl(city, parameters));
    if (!response.ok) {
        throw new Error(`Open-Meteo request failed (${response.status})`);
    }
    return await response.json();
}

async function fetchCurrentWeather(city) {
    return await requestForecast(city, {
        current: FORECAST_API.variables.current,
    });
}

async function fetchHourlyForecast(city) {
    return await requestForecast(city, {
        hourly: FORECAST_API.variables.hourly,
        forecast_hours: 24,
    });
}

async function fetchDailyForecast(city) {
    return await requestForecast(city, {
        daily: FORECAST_API.variables.daily,
        forecast_days: 7,
    });
}

export { fetchCurrentWeather, fetchHourlyForecast, fetchDailyForecast };
