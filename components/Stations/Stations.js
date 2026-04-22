let currentStationsPage = 0;
const stationsPerPage = 6;

/**
 * Adds stations to the Stations page, 
 * rendering station elements based on configuration settings with pagination.
 */
function addStations() {
  const stationsContainer = $(".content-page.p-stations");
  stationsContainer.innerText = "";

  // Retrieve stations from configuration settings
  if (radioConfigs.getItem("stations")) {
    stations = radioConfigs.getItem("stations");
  }

  const start = currentStationsPage * stationsPerPage;
  const end = start + stationsPerPage;
  const paginatedStations = stations.slice(start, end);

  paginatedStations.forEach((station, i) => {
    const actualIndex = start + i;
    let active = "";
    let icon = "play";

    // Check if the current station is active
    if (radioConfigs.stationId == actualIndex) {
      active = "active";
      icon = "pause";
    }

    // If station is a favorite, add the "active" class
    let activeFav = station.favorite ? "active" : "";

    let stationHTML = `
      <div class="station-wrapper sv-flex ${active}" data-id="${actualIndex}">
          <div class="station sv-flex" 
            tooltip${(actualIndex + 1) % 3 == 0 ? "-left" : ""}="${station.title}"
          >
            <img src="${station.image}_.jpg" class="logo-station">
            <img src="img/controls/${icon}.png" class="play-station"/>
            <img src="img/controls/fav.png" class="fav-icon ${activeFav}"/>
          </div>
      </div>
      `;

    stationsContainer.insertAdjacentHTML("beforeend", stationHTML);
  });

  // Add pagination controls
  const totalPages = Math.ceil(stations.length / stationsPerPage);
  if (totalPages > 1) {
    const paginationHTML = `
    <div class="page-info-bubble">${currentStationsPage + 1}/${totalPages}</div>
      <button id="prev-page" class="nav-arrow prev" ${currentStationsPage === 0 ? "disabled" : ""}>
        <div class="arrow-icon"></div>
      </button>
      <button id="next-page" class="nav-arrow next" ${currentStationsPage === totalPages - 1 ? "disabled" : ""}>
        <div class="arrow-icon"></div>
      </button>
    `;

    stationsContainer.insertAdjacentHTML("afterbegin", paginationHTML);

    $("#prev-page").onclick = (e) => {
      e.stopPropagation();
      if (currentStationsPage > 0) {
        currentStationsPage--;
        addStations();
      }
    };

    $("#next-page").onclick = (e) => {
      e.stopPropagation();
      if (currentStationsPage < totalPages - 1) {
        currentStationsPage++;
        addStations();
      }
    };
  }


  // Play radio station on click
  $$(".station-wrapper").forEach((station) => {
    station.addEventListener("click", () => {
      const stationID = parseInt(station.getAttribute("data-id"));
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
$("#p-stations").addEventListener("click", () => {
  currentStationsPage = 0; // Reset to first page when opening the list
  addStations();
});

