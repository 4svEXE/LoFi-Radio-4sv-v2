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

/**
 * Ensures the offscreen document is created.
 * @param {string} path - Path to the offscreen document.
 */
async function setupOffscreenDocument(path) {
  // Check if offscreen document already exists
  if (await chrome.offscreen.hasDocument()) {
    return;
  }

  // Create offscreen document
  try {
    await chrome.offscreen.createDocument({
      url: path,
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Playback of Lo-Fi radio stations in the background.',
    });
    console.log('Offscreen document created.');
  } catch (error) {
    console.error('Error creating offscreen document:', error);
  }
}
