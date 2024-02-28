class LocalStorageItem {
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

  save() {
    localStorage.setItem(APP_NAME, JSON.stringify(this));
  }

  load() {
    let LoFiRadio = JSON.parse(localStorage.getItem(APP_NAME));

    for (const key in LoFiRadio) {
      if (Object.hasOwnProperty.call(LoFiRadio, key)) {
        this[key] = LoFiRadio[key];
      }
    }
  }

  getItem(key) {
    if (this[key] !== "undefined") {
      return this[key];
    } else {
      console.error(key + " does not exist");
      return NULL;
    }
  }

  setItem(key, value) {
    this[key] = value;
    this.save();
  }
}
