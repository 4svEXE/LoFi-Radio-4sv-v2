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

// show cat`s skin
function renderCat(idSkin) {
  $("#cat").src = `./img/cat/cat-${cat.skins[idSkin]}.gif`;

  //sounds for the cat
  $("#cat").addEventListener("mouseover", () => {
    if (idSkin - 1 >= 0) {
      playSound(`./sound/cat/${idSkin - 1}.mp3`);
    }
  });
}
renderCat(cat.currentSkin);

function setNextSkin() {
  cat.currentSkin++;
  if (cat.currentSkin >= cat.skins.length) cat.currentSkin = 0;

  localStorage.setItem(APP_CAT, cat.currentSkin);
  renderCat(cat.currentSkin);
}

$("#cat").addEventListener("click", function () {
  setNextSkin();
});
