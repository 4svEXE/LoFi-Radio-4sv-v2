/**
 * Service Worker for 4sv LoFi Radio v3.
 * Manages the offscreen document for audio playback.
 */

const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ensure-offscreen') {
    setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
    sendResponse({ status: 'offscreen_ensured' });
  }
  return true;
});

// Setup offscreen document when extension starts or installs
chrome.runtime.onStartup.addListener(() => {
  setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
});

chrome.runtime.onInstalled.addListener(() => {
  setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
});

let creatingOffscreenPromise = null;

/**
 * Ensures the offscreen document is created.
 * @param {string} path - Path to the offscreen document.
 */
async function setupOffscreenDocument(path) {
  // Check if offscreen document already exists
  if (await chrome.offscreen.hasDocument()) {
    return;
  }

  // Prevent multiple concurrent calls creating documents simultaneously
  if (creatingOffscreenPromise) {
    await creatingOffscreenPromise;
    return;
  }

  // Create offscreen document
  try {
    creatingOffscreenPromise = chrome.offscreen.createDocument({
      url: path,
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playback of Lo-Fi radio stations in the background.',
    });
    await creatingOffscreenPromise;
    console.log('Offscreen document created.');
  } catch (error) {
    if (!error.message?.includes('Only a single offscreen document may be created')) {
      console.error('Error creating offscreen document:', error);
    }
  } finally {
    creatingOffscreenPromise = null;
  }
}
