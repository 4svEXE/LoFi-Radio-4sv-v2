/**
 * Array representing radio stations with default loading station.
 * @type {Array<object>}
 */
var stations = [
  {
    title: "loading...",
    image: "img/stations/01.gif",
    url: "https://radio4.vip-radios.fm:18027/stream-128kmp3-YogaChill",
    favorite: false,
  },
];

/**
 * Merges local custom stations and folders into the main stations list.
 */
function mergeCustomStations(baseStations) {
  let customList = radioConfigs.getItem("customStations") || [];
  // Ensure array
  if (!Array.isArray(customList)) customList = [];

  // Filter out any duplicates if already present
  const existingUrls = new Set(baseStations.map(s => s.url || s.id));
  const newCustom = customList.filter(cs => !existingUrls.has(cs.url || cs.id));

  return [...baseStations, ...newCustom];
}

// Synchronously initialize stations with cached stations or custom stations right away
if (radioConfigs.getItem("stations")) {
  stations = radioConfigs.getItem("stations");
} else {
  stations = mergeCustomStations(stations);
}

/**
 * Asynchronous function to retrieve data from the database.
 * Fetches station data from a GitHub repository.
 * Decodes base64 content and updates the stations array accordingly.
 * @async
 */
async function getDataFromDB() {
  const url = "https://api.github.com/repos/4svEXE/";
  const path = "4svLoFiRadioDB/contents/stations.json?ref=main";

  // Connect to the database
  try {
    const response = await fetch(url + path);
    const data = await response.json();

    // Decoding base64 content
    const decodedData = JSON.parse(atob(data.content))[0];

    //Checks if local configurations or decoded data should be used.
    let shouldUseLocalConfig = true;

    if (
      radioConfigs.getItem("stations") &&
      decodedData.version > radioConfigs.getItem("version")
    ) {
      shouldUseLocalConfig = false;
    }

    console.log(
      "v: ",
      decodedData.version,
      radioConfigs.getItem("version"),
      shouldUseLocalConfig
    );

    //Updates the stations array based on the condition.
    stations = shouldUseLocalConfig
      ? radioConfigs.getItem("stations")
      : decodedData.stations;

    //Checks if decoded data should be updated in the local configurations.
    if (!shouldUseLocalConfig) {
      console.log("!shouldUseLocalConfig", decodedData);
      radioConfigs.setItem("stations", decodedData.stations);
      radioConfigs.setItem("version", decodedData.version);
    }

    //Updates the stations array with decoded data.
    if (decodedData?.stations) stations = decodedData?.stations;

    console.log("stations", stations, decodedData?.stations);
  } catch (error) {
    console.log("error", error);
  }

  // Preserve user's custom stations
  stations = mergeCustomStations(stations);
  radioConfigs.setItem("stations", stations);

  // Add stations to the UI
  addStations();

  // Renders the current station
  renderStation(radioConfigs.getItem("stationId"), false);
}

// Fetch data from the database when the script is executed
getDataFromDB();
