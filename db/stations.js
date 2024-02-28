var stations = [
  {
    title: "loading...",
    image: "img/stations/01.gif",
    url: "https://radio4.vip-radios.fm:18027/stream-128kmp3-YogaChill",
    favorite: false,
  },
];

async function getDataFromDB() {
  const url = "https://api.github.com/repos/4svEXE/";
  const path = "4svLoFiRadioDB/contents/stations.json?ref=main";

  // Connect to db
  try {
    const response = await fetch(url + path);
    const data = await response.json();

    // decoding base64
    const decodedData = JSON.parse(atob(data.content))[0];

    if (
      radioConfigs.getItem("stations") ||
      decodedData.version <= radioConfigs.getItem("version")
    ) {
      stations = radioConfigs.getItem("stations");
    } else {
      radioConfigs.setItem("stations", decodedData.stations);
      radioConfigs.setItem("version", decodedData.version);
    }

    stations = decodedData?.stations || stations;

  } catch (error) {
    console.log("error", error);
  }

  addStations();
  renderStation(radioConfigs.getItem('stationId'));
}

getDataFromDB();
