let currentStation = radioConfigs.stationId || 0;

$("#play").onclick = () => updateControls();

function updateControls() {
  if (radioConfigs.getItem("play") === "true") {
    radioConfigs.setItem("play", "false");
    $("#play").src = "img/controls/play.png";
  } else {
    radioConfigs.setItem("play", "true");
    $("#play").src = "img/controls/pause.png";
  }

  $("#loader").classList.add("active");
}

//logic for adding/deleting station to favorites
$("#fav_icon").addEventListener("click", () => {
  $("#fav_icon").classList.toggle("active");
  
  stations[currentStation].favorite = !stations[currentStation].favorite;

  //sorting the stations by favorite
  let tmp = [];
  stations.forEach((station) => {
    if (station.favorite) {
      tmp.unshift(station);
    } else {
      tmp.push(station);
    }
  });

  stations = tmp;

  if(!stations[currentStation].favorite){
    currentStation = 0;
  }

  renderStation(currentStation); //function from Controls.js
  addStations();
});

$("#next").onclick = () => {
  currentStation++;
  if (currentStation >= stations.length) currentStation = 0;
  renderStation(currentStation);
};

$("#prew").onclick = () => {
  currentStation--;
  if (currentStation < 0) currentStation = stations.length - 1;
  renderStation(currentStation);
};

function renderStation(station) {
  let animateStationImage = radioConfigs.getItem("animations") ? "" : "_.jpg";

  if (station >= stations.length) station = 0;

  $("#s-title").innerText = stations[station].title;
  $("#s-logo").src = stations[station].image + animateStationImage;

  radioConfigs.setItem("url", stations[station].url);
  radioConfigs.setItem("play", "true");
  radioConfigs.setItem("stationId", station);

  updateControls();

  if (stations[currentStation]?.favorite) {
    $("#fav_icon").classList.add("active");
  } else {
    $("#fav_icon").classList.remove("active");
  }

  setTimeout(() => {
    radioConfigs.setItem("play", "false");
  }, 100);
  setTimeout(() => updateControls(), 500);
}
renderStation(radioConfigs.getItem("stationId"));

// VOLUME CONTROL
$("#volume").onchange = () => {
  radioConfigs.setItem("volume", $("#volume").value);
  if (radioConfigs.getItem("volume") != 0) {
    $("#sound").volume = radioConfigs.getItem("volume");
    radioConfigs.setItem("soundsVolume", $("#sound").volume);
  }
};
$("#volume").value = radioConfigs.getItem("volume");

function setAndRenderVolume(vol){
  radioConfigs.setItem("volume", (vol));

  $("#sound").volume = radioConfigs.getItem("volume");
  $("#volume").value = radioConfigs.getItem("volume");
}

// sound icons clicks
$("#sound-min").onclick = () => {
  let currentVolume = radioConfigs.getItem("volume");

  if (currentVolume >= 0) {
    setAndRenderVolume(currentVolume -= 0.1)
  } else {
    setAndRenderVolume(0)
  }
};

$("#sound-max").onclick = () => {
  let currentVolume = radioConfigs.getItem("volume");

  if (currentVolume <= 0.9) {
    setAndRenderVolume(currentVolume += 0.1)
  } else {
    setAndRenderVolume(1)
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
      dubbleToggle("#back-to-controls", 'blink', 1000)
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
