/**
 * Default configuration for localStorage item.
 * @type {object}
 */
const defaultLSConfig = {
  url: "https://stream-27.zeno.fm/0r0xa792kwzuv?zs=6aokNGKPRSuD8bxc0o2AvQ",
  stationId: 0,
  volume: 0.5,
  themeId: 0,
  play: false,
  soundsVolume: 0.6,
  animations: true,
  version: 0.1,
  isFolder: false,
  folderId: null,
};


/**
 * Instance of the LocalStorageItem class representing the radio configurations.
 * @type {LocalStorageItem}
 */
let radioConfigs = new LocalStorageItem(defaultLSConfig);

// Ensure the offscreen document is open for audio playback in MV3
chrome.runtime.sendMessage({ type: 'ensure-offscreen' });

/**
 * Load radio configurations from localStorage if available, otherwise save default configurations.
 */

if (localStorage.getItem(APP_NAME)) {
  radioConfigs.load();
} else {
  radioConfigs.save();
}

/**
 * Periodically checks if the radio is playing and removes the 'active' class from the loader if it is.
 * Also syncs track title if playing a local music folder.
 */
setInterval(() => {
  if (localStorage.getItem(APP_NAME + "Play") === "true") {
    $("#loader").classList.remove("active");
  }

  if (radioConfigs.getItem("isFolder")) {
    const trackTitle = localStorage.getItem(APP_NAME + "FolderTrackTitle");
    if ($("#s-title")) {
      // Ensure folder name is displayed as the title
      const stationId = parseInt(radioConfigs.getItem("stationId")) || 0;
      const currentStations = radioConfigs.getItem("stations") || stations;
      const currentStationObj = currentStations && currentStations[stationId];
      const folderName = (currentStationObj && currentStationObj.title) || "Local Music";
      
      if ($("#s-title").innerText !== folderName) {
        $("#s-title").innerText = folderName;
      }
      if (trackTitle) {
        $("#s-title").setAttribute("title", "Track: " + trackTitle);
      }
    }
  } else if ($("#s-title") && $("#s-title").hasAttribute("title")) {
    $("#s-title").removeAttribute("title");
  }
}, 100);
