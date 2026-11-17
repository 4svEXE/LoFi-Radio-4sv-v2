/**
 * Offscreen script for 4sv LoFi Radio.
 * Polls localStorage to control the audio element and supports folder playlist playback.
 */

let currentPlayingFolderId = null;
let currentFolderTracks = [];
let currentFolderTrackIndex = 0;
let currentBlobUrl = null;
let isSettingUpTrack = false;

const radio = $(".radio");

// Listen for audio ended event for continuous folder autoplay
radio.addEventListener("ended", () => {
  const rawStorage = localStorage.getItem(APP_NAME);
  if (!rawStorage) return;
  const storage = JSON.parse(rawStorage);

  if (storage.isFolder && currentFolderTracks.length > 0) {
    playNextFolderTrack();
  }
});

// If track encounters error, skip to next in folder
radio.addEventListener("error", (e) => {
  const rawStorage = localStorage.getItem(APP_NAME);
  if (!rawStorage) return;
  const storage = JSON.parse(rawStorage);

  if (storage.isFolder && currentFolderTracks.length > 0 && !isSettingUpTrack) {
    console.warn("Track error in folder playback, trying next track...", e);
    setTimeout(() => {
      playNextFolderTrack();
    }, 500);
  }
});

async function loadFolderTracks(folderId, targetIndex = 0) {
  try {
    const folder = await LocalMusicDB.getFolder(folderId);
    if (!folder || !folder.files || folder.files.length === 0) {
      console.warn("Folder is empty or not found:", folderId);
      currentPlayingFolderId = null;
      currentFolderTracks = [];
      return;
    }

    currentPlayingFolderId = folderId;
    currentFolderTracks = folder.files;
    currentFolderTrackIndex = targetIndex % currentFolderTracks.length;
    await playCurrentFolderTrack();
  } catch (err) {
    console.error("Failed to load folder tracks:", err);
  }
}

async function playCurrentFolderTrack() {
  if (currentFolderTracks.length === 0) return;
  isSettingUpTrack = true;

  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  const track = currentFolderTracks[currentFolderTrackIndex];
  currentBlobUrl = URL.createObjectURL(track.blob);
  radio.src = currentBlobUrl;

  try {
    const rawStorage = localStorage.getItem(APP_NAME);
    if (rawStorage) {
      const storage = JSON.parse(rawStorage);
      radio.volume = storage.volume !== undefined ? storage.volume : 0.5;
      
      // Update currently playing track info for UI title
      localStorage.setItem(APP_NAME + 'FolderTrackTitle', track.name.replace(/\.[^/.]+$/, ""));
      localStorage.setItem(APP_NAME + 'FolderTrackIndex', currentFolderTrackIndex);
    }

    await radio.play();
    localStorage.setItem(APP_NAME + 'Play', 'true');
  } catch (error) {
    console.error("Folder playback play error:", error);
  } finally {
    isSettingUpTrack = false;
  }
}

function playNextFolderTrack() {
  if (currentFolderTracks.length === 0) return;
  currentFolderTrackIndex = (currentFolderTrackIndex + 1) % currentFolderTracks.length;
  playCurrentFolderTrack();
}

function playPrevFolderTrack() {
  if (currentFolderTracks.length === 0) return;
  currentFolderTrackIndex = (currentFolderTrackIndex - 1 + currentFolderTracks.length) % currentFolderTracks.length;
  playCurrentFolderTrack();
}

// Listen for direct messages from popup if needed (e.g. skip track inside folder)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'folder-next-track') {
    playNextFolderTrack();
    sendResponse({ status: 'ok', index: currentFolderTrackIndex });
  } else if (message.type === 'folder-prev-track') {
    playPrevFolderTrack();
    sendResponse({ status: 'ok', index: currentFolderTrackIndex });
  }
  return true;
});

setInterval(() => {
  const rawStorage = localStorage.getItem(APP_NAME);
  if (!rawStorage) return;

  const storage = JSON.parse(rawStorage);

  if (storage.isFolder) {
    // Handling Local Folder Playback
    if (currentPlayingFolderId !== storage.folderId) {
      loadFolderTracks(storage.folderId);
    } else {
      if (storage.play === "true") {
        if (radio.paused && !isSettingUpTrack && radio.src) {
          radio.play().then(() => {
            localStorage.setItem(APP_NAME + 'Play', 'true');
          }).catch((err) => {
            console.error("Folder resume error:", err);
          });
        }
      } else {
        if (!radio.paused) {
          radio.pause();
        }
        localStorage.setItem(APP_NAME + 'Play', 'false');
      }
    }
  } else {
    // Normal Web Stream Playback
    if (currentPlayingFolderId !== null) {
      // Switched away from local folder
      currentPlayingFolderId = null;
      currentFolderTracks = [];
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = null;
      }
      localStorage.removeItem(APP_NAME + 'FolderTrackTitle');
      localStorage.removeItem(APP_NAME + 'FolderTrackIndex');
    }

    if (storage.play === "true") {
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
      if (!radio.paused) {
        radio.pause();
      }
      if (radio.src !== storage.url) {
        radio.src = storage.url;
      }
      localStorage.setItem(APP_NAME + 'Play', 'false');
    }
  }

  // Update volume
  if (storage.volume !== undefined) {
    radio.volume = storage.volume;
  }
}, 100);
