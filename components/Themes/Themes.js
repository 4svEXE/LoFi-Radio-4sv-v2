/**
 * Sets a CSS variable on the root element.
 * @param {string} variable - The name of the CSS variable.
 * @param {string} property - The value to set for the CSS variable.
 */
function setCssVar(variable, property) {
  let root = document.documentElement;
  root.style.setProperty(variable, property);
}

/**
 * Adds theme buttons and handles their events, including creation, deletion, and rendering.
 */
function addThemes() {
  $(".content-page.p-themes").innerText = "";
  themes.forEach((theme, i) => {
    let active = "";
    if (radioConfigs.themeId == i) active = "active";
    let item = `
          <div class="theme-button-container sv-flex">
            <div 
              class="theme-button ${active}"
              style="background: ${theme["--nav-bg-color"]}"
            ></div>
            <div class="theme-delete-button sv-flex">+</div>
          </div>
        `;

    $(".content-page.p-themes").insertAdjacentHTML("beforeend", item);
  });

  // add button for creating a new theme
  let addNewThemeButton = `
    <div class="theme-button-container sv-flex">
      <div class="add-new-theme sv-flex" onClick()>
      +
      </div>
    </div>
  `;
  $(".content-page.p-themes").insertAdjacentHTML(
    "beforeend",
    addNewThemeButton
  );
  upgrageInputsTypeColor();

  let addNewThemePage = `
    <div class="p-add-themes">
      ${AddNewTheme()}
    </div>
  `;
  $(".content-page.p-themes").insertAdjacentHTML("beforeend", addNewThemePage);

  // render the clicked theme
  $$(".theme-button").forEach((theme, i) => {
    theme.addEventListener("click", () => {
      renderTheme(i);
      radioConfigs.setItem("themeId", i);
      $(".content-page.p-themes").innerText = "";
      addThemes();
    });
  });

  // delete theme
  $$(".theme-delete-button").forEach((button, id) => {
    button.addEventListener("click", async () => {
      try {
        if (
          await openModal(
            "Delete theme.",
            "Are you sure you want to delete this theme?"
          )
        ) {
          themes.splice(id, 1);
          radioConfigs.setItem("themes", themes);

          if (radioConfigs.themeId > id) {
            radioConfigs.setItem("themeId", radioConfigs.themeId - 1);
          }

          renderTheme(radioConfigs.themeId);

          addThemes();
        }
      } catch (err) {
        renderTheme(0);
        console.error(err);
      }
    });
  });
}

// Initialize themes
addThemes();

/**
 * Renders a theme by setting CSS variables based on the provided theme index.
 * @param {number} id - The index of the theme to render.
 */
function renderTheme(id) {
  for (const key in themes[id]) {
    if (Object.hasOwnProperty.call(themes[id], key)) {
      const element = themes[id][key];
      setCssVar(key, element);
    }
  }
}

// Render the initial theme
renderTheme(radioConfigs.themeId);

// Save theme
let newTheme = {};

/**
 * Upgrades input type color and handles related events.
 */
function upgrageInputsTypeColor() {
  setTimeout(() => {
    // show page adding new themes
    $(".add-new-theme").addEventListener("click", () => {
      $(".p-add-themes").classList.add("active");
    });

    // hide page adding new themes
    $("#back-to-themes").addEventListener("click", () => {
      $(".p-add-themes").classList.remove("active");
    });

    $$(".input-color").forEach((item) => {
      item.addEventListener("change", () => {
        setCssVar("--" + item.id, item.value);
      });
    });

    $("#save-theme").addEventListener("click", () => {
      $(".p-add-themes").classList.remove("active");
      $$(".input-color").forEach((item) => {
        newTheme["--" + item.id] = item.value;
      });
      saveTheme();
    });
  }, 200);
}

// Initialize input color upgrades
upgrageInputsTypeColor();

/**
 * Saves the new theme by adding it to the themes array and updating configuration settings.
 */
function saveTheme() {
  console.log("Saving theme");
  themes.push(newTheme);

  radioConfigs.setItem("themes", themes);
  radioConfigs.setItem("themeId", themes.length - 1);

  upgrageInputsTypeColor();
  addThemes();
}
