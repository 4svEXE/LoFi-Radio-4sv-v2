let currentStation = parseInt(radioConfigs.getItem("stationId")) || 0;

$("#play").onclick = () => {
  if (radioConfigs.getItem("play") === "true") {
    radioConfigs.setItem("play", "false");
  } else {
    radioConfigs.setItem("play", "true");
  }
  updateControls();
};

function updateControls() {
  // Ensure offscreen document is active before trying to play
  chrome.runtime.sendMessage({ type: 'ensure-offscreen' });

  if (radioConfigs.getItem("play") === "true") {
    $("#play").src = "img/controls/pause.png";
  } else {
    $("#play").src = "img/controls/play.png";
  }

  $("#loader").classList.add("active");
}

// Logic for adding/deleting station to favorites
$("#fav_icon").addEventListener("click", () => {
  if (radioConfigs.getItem("stations")) {
    stations = radioConfigs.getItem("stations");
  }
  if (!stations[currentStation]) return;
  $("#fav_icon").classList.toggle("active");

  stations[currentStation].favorite = !stations[currentStation].favorite;

  // Sorting the stations by favorite
  let tmp = [];
  stations.forEach((station) => {
    if (station.favorite) {
      tmp.unshift(station);
    } else {
      tmp.push(station);
    }
  });

  stations = tmp;

  if (!stations[currentStation] || !stations[currentStation].favorite) {
    currentStation = 0;
  }

  radioConfigs.setItem("stations", stations);

  renderStation(currentStation);
  if (typeof addStations === "function") {
    addStations();
  }

  console.log("rendered", currentStation, stations[currentStation], stations);
});

$("#next").onclick = () => {
  if (radioConfigs.getItem("stations")) {
    stations = radioConfigs.getItem("stations");
  }
  currentStation = parseInt(radioConfigs.getItem("stationId")) || 0;
  currentStation++;
  if (currentStation >= stations.length) currentStation = 0;
  renderStation(currentStation);
  if (typeof addStations === "function") {
    currentStationsPage = Math.floor(currentStation / stationsPerPage);
    addStations();
  }
};

$("#prew").onclick = () => {
  if (radioConfigs.getItem("stations")) {
    stations = radioConfigs.getItem("stations");
  }
  currentStation = parseInt(radioConfigs.getItem("stationId")) || 0;
  currentStation--;
  if (currentStation < 0) currentStation = stations.length - 1;
  renderStation(currentStation);
  if (typeof addStations === "function") {
    currentStationsPage = Math.floor(currentStation / stationsPerPage);
    addStations();
  }
};

function updateStationCounter() {
  $("#w-title").innerText = `${currentStation + 1}/${stations.length}`;
}

function renderStation(station, triggerPlay = true) {
  if (radioConfigs.getItem("stations")) {
    stations = radioConfigs.getItem("stations");
  }
  if (!stations || stations.length === 0) return;
  let animateStationImage = radioConfigs.getItem("animations") ? "" : "_.jpg";

  if (station >= stations.length) station = 0;
  if (station < 0) station = 0;

  const targetStation = stations[station];
  if (!targetStation) return;

  $("#s-title").innerText = targetStation.title;

  // Check if image is an internal gif/jpg or external / svg
  if (targetStation.image && targetStation.image.startsWith("img/stations/")) {
    $("#s-logo").src = targetStation.image + animateStationImage;
  } else if (targetStation.image) {
    $("#s-logo").src = targetStation.image;
  } else {
    $("#s-logo").src = "img/stations/01.gif" + animateStationImage;
  }

  if (targetStation.isLocalFolder) {
    radioConfigs.setItem("isFolder", true);
    radioConfigs.setItem("folderId", targetStation.id);
    radioConfigs.setItem("url", "");
  } else {
    radioConfigs.setItem("isFolder", false);
    radioConfigs.setItem("folderId", null);
    radioConfigs.setItem("url", targetStation.url);
  }

  currentStation = station;
  radioConfigs.setItem("stationId", station);

  if (triggerPlay) {
    radioConfigs.setItem("play", "true");
    updateControls();
  }
  updateStationCounter();

  if (stations[currentStation]?.favorite) {
    $("#fav_icon").classList.add("active");
  } else {
    $("#fav_icon").classList.remove("active");
  }

  if (triggerPlay) {
    setTimeout(() => {
      radioConfigs.setItem("play", "false");
    }, 100);
    setTimeout(() => updateControls(), 500);
  }
}
renderStation(radioConfigs.getItem("stationId"), false);

// VOLUME CONTROL
$("#volume").onchange = () => {
  radioConfigs.setItem("volume", $("#volume").value);
  if (radioConfigs.getItem("volume") != 0) {
    $("#sound").volume = radioConfigs.getItem("volume");
    radioConfigs.setItem("soundsVolume", $("#sound").volume);
  }
};
$("#volume").value = radioConfigs.getItem("volume");

function setAndRenderVolume(vol) {
  radioConfigs.setItem("volume", vol);

  $("#sound").volume = radioConfigs.getItem("volume");
  $("#volume").value = radioConfigs.getItem("volume");
}

// sound icons clicks
$("#sound-min").onclick = () => {
  let currentVolume = radioConfigs.getItem("volume");

  if (currentVolume >= 0) {
    setAndRenderVolume((currentVolume -= 0.1));
  } else {
    setAndRenderVolume(0);
  }
};

$("#sound-max").onclick = () => {
  let currentVolume = radioConfigs.getItem("volume");

  if (currentVolume <= 0.9) {
    setAndRenderVolume((currentVolume += 0.1));
  } else {
    setAndRenderVolume(1);
  }
};

// activate nav bar buttons
$$(".nav-bar-button").forEach((element) => {
  element.addEventListener("click", () => {
    if (!element.classList.contains("active")) {
      $$(".nav-bar-button").forEach((el) => {
        el.classList.remove("active");
      });
      setTimeout(() => element.classList.add("active"), 100);

      $$(".content-page").forEach((el) => {
        if (!el.classList.contains(element.id)) {
          el.classList.remove("active");
        }
      });
      $("." + element.id).classList.toggle("active");

      $("#back-to-controls").classList.add("active");

      if ($("." + element.id).classList.contains("active")) {
        $(".station-controls").classList.remove("active");
      } else {
        $(".station-controls").classList.add("active");
      }
    } else {
      dubbleToggle("#back-to-controls", "blink", 1000);
    }
  });
});

// unactive all buttons in the navbar & show the controls page
$("#back-to-controls").onclick = () => {
  $$(".content-page").forEach((el) => {
    el.classList.remove("active");
  });
  $$(".nav-bar-button").forEach((el) => {
    el.classList.remove("active");
  });
  $("#back-to-controls").classList.remove("active");
  $(".station-controls").classList.add("active");
};
