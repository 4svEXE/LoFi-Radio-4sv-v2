$("#sounds").addEventListener("click", () => {
  if ($("#sounds").checked) {
    $("#sound").volume = radioConfigs.getItem("volume");
    radioConfigs.setItem("soundsVolume", $("#sound").volume);
  } else {
    $("#sound").volume = 0;
    radioConfigs.setItem("soundsVolume", 0);
  }
});

$("#sound").volume = radioConfigs.getItem("soundsVolume");
$("#sounds").checked = radioConfigs.getItem("soundsVolume");

// animate videos

$("#animations").addEventListener("click", () => {
  if ($("#animations").checked) {
    radioConfigs.setItem("animations", true);
  } else {
    radioConfigs.setItem("animations", false);
  }

  renderStation(currentStation)
});

$("#animations").checked = radioConfigs.getItem("animations");

// roll back
$("#roll-back-sennings").addEventListener("click", async () => {
  try {
    if (
      await openModal(
        "Roll back.",
        "are you sure you want to return to default settings?"
      )
    ) {
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
