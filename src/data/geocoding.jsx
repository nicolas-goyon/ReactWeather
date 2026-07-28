const GeoCodingAPI = {
    baseUrl: "https://geocoding-api.open-meteo.com/v1/",
    baseOptions: {
        language: "fr",
        count: 20,
    },
}

async function AutoCompleteCity(city) {
  const url = `${GeoCodingAPI.baseUrl}search?name=${city}&language=${GeoCodingAPI.baseOptions.language}&count=${GeoCodingAPI.baseOptions.count}`;
  const response = await fetch(url);
  const data = await response.json();
  data.results.sort((a, b) =>{
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