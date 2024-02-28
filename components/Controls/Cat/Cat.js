const APP_CAT = "4sv-cat";
let cat = {
  skins: ["black", "sleep", "walk", "fall", "eat", "nia", "dance", "playing"],
  currentSkin: 0,
};

// Get skin id from the local storage
if (!localStorage.getItem(APP_CAT)) {
  localStorage.setItem(APP_CAT, cat.currentSkin);
} else {
  cat.currentSkin = localStorage.getItem(APP_CAT);
}

/**
 * Renders the cat with the specified skin.
 * @param {number} skinId - The index of the cat skin to render.
 */
function renderCat(skinId) {
  /**
   * Element representing the cat image.
   * @type {HTMLImageElement}
   */
  const catImage = $("#cat");
  catImage.src = `./img/cat/cat-${cat.skins[skinId]}.gif`;

  // Sounds for the cat
  catImage.addEventListener("mouseover", () => {
    if (skinId - 1 >= 0) {
      playSound(`./sound/cat/${skinId - 1}.mp3`);
    }
  });
}

// Render the initial cat with the current skin
renderCat(cat.currentSkin);

/**
 * Sets the next cat skin and updates local storage.
 */
function setNextSkin() {
  cat.currentSkin++;
  if (cat.currentSkin >= cat.skins.length) cat.currentSkin = 0;

  localStorage.setItem(APP_CAT, cat.currentSkin);
  renderCat(cat.currentSkin);
}

// Add click event listener to change cat skin on click
$("#cat").addEventListener("click", function () {
  setNextSkin();
});
