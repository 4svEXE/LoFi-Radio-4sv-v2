/**
 * Offscreen script for 4sv LoFi Radio.
 * Polls localStorage to control the audio element and supports folder playlist playback.
 */

let currentPlayingFolderId = null;
let currentFolderTracks = [];
let currentFolderTrackIndex = 0;
let currentBlobUrl = null;
let isSettingUpTrack = false;
let seekTargetTime = null;

const radio = $(".radio");

// Track current time progress and save to localStorage
radio.addEventListener("timeupdate", () => {
  if (currentPlayingFolderId && radio.currentTime > 0) {
    localStorage.setItem(APP_NAME + 'FolderPlaybackState_' + currentPlayingFolderId, JSON.stringify({
      trackIndex: currentFolderTrackIndex,
      time: Math.floor(radio.currentTime)
    }));
  }
});

// Once metadata is loaded, if we have a saved time to resume, seek to it
radio.addEventListener("loadedmetadata", () => {
  if (seekTargetTime !== null && seekTargetTime > 0) {
    if (seekTargetTime < radio.duration) {
      radio.currentTime = seekTargetTime;
    }
    seekTargetTime = null;
  }
});

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

async function loadFolderTracks(folderId) {
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

    // Check if there is saved playback state (resume last track and time)
    const savedStateRaw = localStorage.getItem(APP_NAME + 'FolderPlaybackState_' + folderId);
    let targetIndex = 0;
    let targetTime = 0;

    if (savedStateRaw) {
      try {
        const state = JSON.parse(savedStateRaw);
        if (state.trackIndex !== undefined && state.trackIndex < currentFolderTracks.length) {
          targetIndex = state.trackIndex;
        }
        if (state.time !== undefined && state.time > 0) {
          targetTime = state.time;
        }
      } catch (e) {
        console.error("Error reading saved folder playback state:", e);
      }
    } else {
      // If no saved state, start from a random track and random position
      targetIndex = Math.floor(Math.random() * currentFolderTracks.length);
      // We will allow loadedmetadata or initial track to pick a random time (or seek after metadata)
      // For first time random play, we set seekTargetTime to a random percentage (e.g. 10s - 60s) or let loadedmetadata pick
      targetTime = -1; // -1 indicates random start position
    }

    currentFolderTrackIndex = targetIndex;
    await playCurrentFolderTrack(targetTime);
  } catch (err) {
    console.error("Failed to load folder tracks:", err);
  }
}

async function playCurrentFolderTrack(initialSeekTime = null) {
  if (currentFolderTracks.length === 0) return;
  isSettingUpTrack = true;

  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }

  const track = currentFolderTracks[currentFolderTrackIndex];
  currentBlobUrl = URL.createObjectURL(track.blob);
  radio.src = currentBlobUrl;

  if (initialSeekTime === -1) {
    // When metadata loads, seek to random position
    const onMeta = () => {
      if (radio.duration && radio.duration > 20) {
        // Random time between 0 and 70% of duration
        radio.currentTime = Math.floor(Math.random() * (radio.duration * 0.7));
      }
      radio.removeEventListener("loadedmetadata", onMeta);
    };
    radio.addEventListener("loadedmetadata", onMeta);
  } else if (initialSeekTime !== null && initialSeekTime > 0) {
    seekTargetTime = initialSeekTime;
  } else {
    seekTargetTime = null;
  }

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
