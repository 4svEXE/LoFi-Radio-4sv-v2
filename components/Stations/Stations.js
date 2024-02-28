/**
 * Adds stations to the Stations page, 
 * rendering station elements based on configuration settings.
 */
function addStations() {
  $(".content-page.p-stations").innerText = "";

  // Retrieve stations from configuration settings
  if (radioConfigs.getItem("stations")) {
    stations = radioConfigs.getItem("stations");
  }

  stations.forEach((station, i) => {
    let active = "";
    let icon = "play";

    // Check if the current station is active
    if (radioConfigs.stationId == i) {
      active = "active";
      icon = "pause";
    }

    // If station is a favorite, add the "active" class
    let activeFav = station.favorite ? "active" : "";

    let stationHTML = `
      <div class="station-wrapper sv-flex ${active}">
          <div class="station sv-flex" 
            tooltip${(i + 1) % 3 == 0 ? "-left" : ""}="${station.title}"
          >
            <img src="${station.image}_.jpg" class="logo-station">
            <img src="img/controls/${icon}.png" class="play-station"/>
            <img src="img/controls/fav.png" class="fav-icon ${activeFav}"/>
          </div>
      </div>
      `;

    $(".content-page.p-stations").insertAdjacentHTML("beforeend", stationHTML);
  });

  // Play radio station on click
  $$(".station-wrapper").forEach((station, stationID) => {
    station.addEventListener("click", () => {      
      currentStation = stationID;
      renderStation(stationID); // Function from Controls.js
      addStations();
    });
  });
}

// Initialize stations
addStations();

/**
 * Reloads the stations in the Stations page on clicking 
 * the station button in the navigation.
 */
$("#p-stations").addEventListener("click", () => addStations());
