let sound = $("#sound");

let s_button = "sound/button.mp3";
let s_swipe_on = "sound/swipe-on.mp3";
let s_swipe_off = "sound/swipe.mp3";
let s_click = "sound/click.mp3";
let s_ring = "sound/ring.wav";
let s_modal = "sound/modal.wav";
let s_hover = "sound/hover.mp3";

function playSound(src = s_click) {
  sound.src = src;
  sound.play();
}

$("#animations").addEventListener("click", () => {
  playSound(s_click);
})

$$(".controls").forEach((item) => {
  item.addEventListener("click", () => {
    playSound(s_button);
  });
});

$$(".social").forEach((item) => {
  item.addEventListener("mouseover", () => {
    playSound(s_hover);
  });
});

// Nav Bar buttons sounds
let swiped = false;
$$(".nav-bar-button").forEach((item) => {
  item.addEventListener("click", () => {
    if (!item.classList.contains("active")) {
      playSound(s_swipe_on);
      swiped = true;
    } else {
      playSound(s_click);
    }
  });
});

$("#back-to-controls").addEventListener("click", () => {
  if (swiped) {
    playSound(s_swipe_off);
    swiped = false;
  }
});

// Volume controls
$("#sound-min").addEventListener("click", () => playSound(s_button));
$("#sound-max").addEventListener("click", () => playSound(s_button));

$("#sounds").addEventListener("click", () => playSound(s_ring));

function reloadRenderedSounds(className, sound) {
  setTimeout(() => {
    $$(className).forEach((element) => {
      element.addEventListener("click", () => {
        playSound(sound);
        reloadRenderedSounds(className, sound);
      });
    });
  }, 10);
}

reloadRenderedSounds(".theme-button", s_click);
reloadRenderedSounds(".station", s_click);
