/**
 * Generates HTML content for adding a new theme, 
 * including color input fields and buttons.
 * @returns {string} The HTML content for adding a new theme.
 */
function AddNewTheme() {
  // Ensure the themeId is within valid range
  if (radioConfigs.getItem("themeId") >= themes.length) {
    radioConfigs.setItem("themeId", themes.length - 1);
  }

  /**
   * HTML content for adding a new theme.
   * @type {string}
   */
  const themeHTML = `
    <div class="add-new-theme-buttons sv-flex">
      <input type="button" id="back-to-themes" value="exit">
      <input type="button" id="save-theme" value="save">
    </div> 

    <div class="add-new-theme-content sv-grid">
        <div class="color-card sv-flex sv-col">
            <input type="color" id="main-bg-color" class="input-color" value="${
              themes[radioConfigs.themeId]["--main-bg-color"]
            }">
            <span>background</span>
        </div>

        <div class="color-card sv-flex sv-col" >
            <input type="color" id="nav-bg-color" class="input-color" value="${
              themes[radioConfigs.themeId]["--nav-bg-color"]
            }">
            <span>navigation background</span>
        </div>

        <div class="color-card sv-flex sv-col">
            <input type="color" id="border-bg-color" class="input-color" value="${
              themes[radioConfigs.themeId]["--border-bg-color"]
            }"> 
            <span>borders color</span>
        </div>

        <div class="color-card sv-flex sv-col">
            <input type="color" id="active-bg-color" class="input-color" value="${
              themes[radioConfigs.themeId]["--active-bg-color"]
            }">
            <span>active color</span>
        </div>

        <div class="color-card sv-flex sv-col">
            <input type="color" id="controlss-bg-color" class="input-color" value="${
              themes[radioConfigs.themeId]["--controlss-bg-color"]
            }">
            <span>buttons</span>
        </div>

        <div class="color-card sv-flex sv-col">
            <input type="color" id="text-color" class="input-color" value="${
              themes[radioConfigs.themeId]["--text-color"]
            }">
            <span>text color</span>
        </div>
    </div>
  `;

  return themeHTML;
}
