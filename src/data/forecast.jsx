// Open-Meteo Weather Forecast API
// Documentation: https://open-meteo.com/en/docs

const ForecastAPI = {
    baseUrl: "https://api.open-meteo.com/v1/forecast",

    // Parameters applied to every request (see "Settings" in the docs)
    mainParameters: {
        timezone: "auto",
        temperature_unit: "celsius",
        wind_speed_unit: "kmh",
        precipitation_unit: "mm",
    },

    // Weather variables requested for each forecast type.
    // Any hourly variable is also valid as a current condition.
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
        ],
        daily: [
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
        ],
    },
}

// Merge the city coordinates, the main parameters and the request-specific
// parameters into a request URL. Array values are joined with commas.
function BuildForecastUrl(city, parameters) {
    const url = new URL(ForecastAPI.baseUrl);

    const allParameters = {
        latitude: city.latitude,
        longitude: city.longitude,
        ...ForecastAPI.mainParameters,
        ...parameters,
    };

    for (const [name, value] of Object.entries(allParameters)) {
        url.searchParams.set(name, Array.isArray(value) ? value.join(",") : value);
    }

    return url;
}

async function FetchForecast(city, parameters) {
    const response = await fetch(BuildForecastUrl(city, parameters));
    if (!response.ok) {
        throw new Error(`Open-Meteo request failed (${response.status})`);
    }
    return await response.json();
}

// Current conditions: values in data.current, units in data.current_units
async function WeatherForecast_Current(city) {
    return await FetchForecast(city, {
        current: ForecastAPI.variables.current,
    });
}

// Next 24 hours, hour by hour: values in data.hourly, units in data.hourly_units
async function WeatherForecast_24h(city) {
    return await FetchForecast(city, {
        hourly: ForecastAPI.variables.hourly,
        forecast_hours: 24,
    });
}

// Next 7 days: values in data.daily, units in data.daily_units
async function WeatherForecast_7d(city) {
    return await FetchForecast(city, {
        daily: ForecastAPI.variables.daily,
        forecast_days: 7,
    });
}


export { WeatherForecast_Current, WeatherForecast_24h, WeatherForecast_7d };
