/**
 * Offscreen script for 4sv LoFi Radio.
 * Polls localStorage to control the audio element.
 */

setInterval(() => {
  const rawStorage = localStorage.getItem(APP_NAME);
  if (!rawStorage) return;

  let storage = JSON.parse(rawStorage);
  const radio = $(".radio");

  if (storage.play === "true") {
    // If the station is supposed to be playing
    if (radio.paused || radio.src !== storage.url) {
      if (radio.src !== storage.url) {
        radio.src = storage.url;
      }
      radio.play().then(function () {
        localStorage.setItem(APP_NAME + 'Play', 'true');
      }).catch(function (error) {
        console.error("Playback error:", error);
      });
    }
  } else {
    // If the station is supposed to be paused
    if (!radio.paused) {
      radio.pause();
    }
    // Update src if it changed while paused
    if (radio.src !== storage.url) {
        radio.src = storage.url;
    }
    localStorage.setItem(APP_NAME + 'Play', 'false');
  }

  // Update volume
  radio.volume = storage.volume;
}, 100);
