/**
 * Represents a localStorage item for the 4svLoFiRadio application.
 * @class
 */
class LocalStorageItem {
  /**
   * Creates an instance of LocalStorageItem.
   * @constructor
   * @param {object} options - Options for initializing the LocalStorageItem.
   * @param {string} options.url - The current ststion URL.
   * @param {string} options.stationId - The current station ID.
   * @param {number} options.volume - The volume level associated with the item.
   * @param {string} options.themeId - The theme ID associated with the item.
   * @param {boolean} options.play - The play status associated with the item.
   * @param {number} options.soundsVolume - The sounds volume associated with the item.
   * @param {object} options.themes - The themes associated with the item.
   * @param {object} options.stations - The stations associated with the item.
   * @param {number} [options.version=0.1] - The version of the item (defaults to 0.1 if not provided).
   */
  constructor(options) {
    this.url = options.url;
    this.stationId = options.stationId;
    this.volume = options.volume;
    this.themeId = options.themeId;
    this.play = options.play;
    this.soundsVolume = options.soundsVolume;
    this.themes = options.themes;
    this.stations = options.stations;
    this.version = options.version || 0.1;
  }

  /**
   * Saves the current state of the item to localStorage.
   * @method
   */
  save() {
    localStorage.setItem(APP_NAME, JSON.stringify(this));
  }

  /**
   * Loads the item's state from localStorage.
   * @method
   */
  load() {
    let LoFiRadio = JSON.parse(localStorage.getItem(APP_NAME));

    for (const key in LoFiRadio) {
      if (Object.hasOwnProperty.call(LoFiRadio, key)) {
        this[key] = LoFiRadio[key];
      }
    }
  }

  /**
   * Gets the value of a specific property from the item.
   * @method
   * @param {string} key - The key of the property to retrieve.
   * @returns {*} - The value of the specified property.
   */
  getItem(key) {
    if (this[key] !== "undefined") {
      return this[key];
    } else {
      console.error(key + " does not exist");
      return null;
    }
  }

  /**
   * Sets the value of a specific property in the item and saves the changes.
   * @method
   * @param {string} key - The key of the property to set.
   * @param {*} value - The value to set for the specified property.
   */
  setItem(key, value) {
    this[key] = value;
    this.save();
  }
}
