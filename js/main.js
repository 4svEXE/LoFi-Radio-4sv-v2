/**
 * Default configuration for localStorage item.
 * @type {object}
 */
const defaultLSConfig = {
  url: "https://stream-27.zeno.fm/0r0xa792kwzuv?zs=6aokNGKPRSuD8bxc0o2AvQ",
  stationId: 0,
  volume: 0.8,
  themeId: 0,
  play: false,
  soundsVolume: 0.6,
  animations: true,
  version: 0.1,
};

/**
 * Instance of the LocalStorageItem class representing the radio configurations.
 * @type {LocalStorageItem}
 */
let radioConfigs = new LocalStorageItem(defaultLSConfig);

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
 */
setInterval(() => {
  if (localStorage.getItem(APP_NAME + "Play") === "true") {
    $("#loader").classList.remove("active");
  }
}, 100);
