/**
 * Array representing themes for the application.
 * @type {Array<object>}
 */
var themes;

/**
 * Checks if themes are stored in localStorage; if not,
 * retrieves themes using getThemes function.
 */
if (radioConfigs.getItem("themes")) {
  themes = radioConfigs.getItem("themes");
} else {
  getThemes();
}

/**
 * Function to retrieve default themes in case they are not stored in localStorage.
 * Updates the themes array and saves it to localStorage.
 */
function getThemes() {
  /**
   * Default themes for the application.
   * @type {Array<object>}
   */
  themes = [
    {
      "--text-color": "#000000",
      "--main-bg-color": "#ffffff",
      "--nav-bg-color": "#cccccc",
      "--border-bg-color": "#000000",
      "--active-bg-color": "#ffdd00",
      "--controlss-bg-color": "#f2ecf3",
    },
    {
      "--text-color": "#000000",
      "--main-bg-color": "#ffffff",
      "--nav-bg-color": "#99cccc",
      "--border-bg-color": "#00ff00",
      "--active-bg-color": "#00ff00",
      "--controlss-bg-color": "#ccffcc",
    },
    {
      "--text-color": "#693D3D",
      "--main-bg-color": "#ffffff",
      "--nav-bg-color": "#693D3D",
      "--border-bg-color": "#BA5536",
      "--active-bg-color": "#aa4020",
      "--controlss-bg-color": "#ccffcc",
    },
    {
      "--text-color": "#C60000",
      "--main-bg-color": "#FEF2E4",
      "--nav-bg-color": "#C60000",
      "--border-bg-color": "#805A3B",
      "--active-bg-color": "#FD974F",
      "--controlss-bg-color": "#ccffcc",
    },
    {
      "--text-color": "#003B46",
      "--main-bg-color": "#C4DFE6",
      "--nav-bg-color": "#003B46",
      "--border-bg-color": "#07575B",
      "--active-bg-color": "#66A5AD",
      "--controlss-bg-color": "#66A5AD",
    },
    {
      "--text-color": "#003B46",
      "--main-bg-color": "#FFCCBB",
      "--nav-bg-color": "#6EB5C0",
      "--border-bg-color": "#4f8160",
      "--active-bg-color": "#E2E8E4",
      "--controlss-bg-color": "#bfbfbf",
    },
  ];

  radioConfigs.setItem("themes", themes);
}