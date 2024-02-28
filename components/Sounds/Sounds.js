/**
 * Represents the audio element for playing sounds.
 * @type {HTMLAudioElement}
 */
const sound = $("#sound");

/**
 * Object containing paths to various sound files.
 * @type {Object<string, string>}
 */
const soundPaths = {
  button: "sound/button.mp3",
  swipeOn: "sound/swipe-on.mp3",
  swipeOff: "sound/swipe.mp3",
  click: "sound/click.mp3",
  ring: "sound/ring.wav",
  modal: "sound/modal.wav",
  hover: "sound/hover.mp3",
};

/**
 * Plays a sound with the provided source.
 * @param {string} [src=soundPaths.click] - The source of the sound.
 */
function playSound(src = soundPaths.click) {
  sound.src = src;
  sound.play();
}

// Event listeners for specific elements triggering sounds

/**
 * Event listener for the 'click' event on the #animations element.
 */
$("#animations").addEventListener("click", () => {
  playSound(soundPaths.click);
});

/**
 * Event listener for the 'click' event on elements with the .controls class.
 */
$$(".controls").forEach((item) => {
  item.addEventListener("click", () => {
    playSound(soundPaths.button);
  });
});

/**
 * Event listener for the 'mouseover' event on elements with the .social class.
 */
$$(".social").forEach((item) => {
  item.addEventListener("mouseover", () => {
    playSound(soundPaths.hover);
  });
});

let swiped = false;

// Event listeners for navigation bar buttons triggering sounds

/**
 * Event listener for the 'click' event on elements with the .nav-bar-button class.
 */
$$(".nav-bar-button").forEach((item) => {
  item.addEventListener("click", () => {
    if (!item.classList.contains("active")) {
      playSound(soundPaths.swipeOn);
      swiped = true;
    } else {
      playSound(soundPaths.click);
    }
  });
});

/**
 * Event listener for the 'click' event on the #back-to-controls element.
 */
$("#back-to-controls").addEventListener("click", () => {
  if (swiped) {
    playSound(soundPaths.swipeOff);
    swiped = false;
  }
});

// Event listeners for volume controls triggering sounds

/**
 * Event listener for the 'click' event on the #sound-min element.
 */
$("#sound-min").addEventListener("click", () => playSound(soundPaths.button));

$("#sound-max").addEventListener("click", () => playSound(soundPaths.button));

// Settings.js
$("#sounds").addEventListener("click", () => playSound(soundPaths.ring));

/**
 * Reloads click sounds for elements matching the specified class name after a timeout.
 * @param {string} className - The class name of elements to reload sounds for.
 * @param {string} sound - The sound source to be played on click.
 */
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

// Initial reload of click sounds for theme buttons and stations

reloadRenderedSounds(".theme-button", soundPaths.click);

reloadRenderedSounds(".station", soundPaths.click);
