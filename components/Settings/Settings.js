/**
 * Handles the click event for the "Sounds" checkbox,
 * adjusting volume and saving settings.
 */
$("#sounds").addEventListener("click", () => {
  const soundsCheckbox = $("#sounds");
  const soundElement = $("#sound");

  if (soundsCheckbox.checked) {
    soundElement.volume = radioConfigs.getItem("volume");
    radioConfigs.setItem("soundsVolume", soundElement.volume);
  } else {
    soundElement.volume = 0;
    radioConfigs.setItem("soundsVolume", 0);
  }
});

/**
 * Set the volume and checked status based on stored configurations for sounds.
 */
$("#sound").volume = radioConfigs.getItem("soundsVolume");
$("#sounds").checked = radioConfigs.getItem("soundsVolume");

/**
 * Handles the click event for the "Animations" checkbox,
 * updating settings and rendering.
 */
$("#animations").addEventListener("click", () => {
  /**
   * @type {HTMLInputElement}
   */
  const animationsCheckbox = $("#animations");

  if (animationsCheckbox.checked) {
    radioConfigs.setItem("animations", true);
  } else {
    radioConfigs.setItem("animations", false);
  }

  renderStation(currentStation);
});

/**
 * Set the checked status based on stored configurations for animations.
 */
$("#animations").checked = radioConfigs.getItem("animations");

/**
 * Handles the click event for the "Roll back settings" button
 * prompting for confirmation and taking action.
 */
$("#roll-back-sennings").addEventListener("click", async () => {
  try {
    const shouldRollback = await openModal(
      "Roll back.",
      "Are you sure you want to return to default settings?"
    );

    if (shouldRollback) {
      localStorage.removeItem(APP_NAME);

      radioConfigs = new LocalStorageItem(defaultLSConfig);

      radioConfigs.save();

      getThemes();
      addThemes();
      renderTheme(0);

      updateControls();

      reloadRenderedSounds(".theme-button", s_click);
    }
  } catch (err) {
    console.error(err);
  }
});
