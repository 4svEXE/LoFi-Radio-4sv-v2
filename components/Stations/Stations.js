let currentStationsPage = 0;
const stationsPerPage = 6;

// SVG icons for station / folder badges and default graphics
const folderSvgDataUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f5a623'><path d='M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z'/></svg>";
const customRadioSvgDataUrl = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236c5ce7'><path d='M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h2v2zm0-4h-2V6h2v2z'/></svg>";

let editingStationIndex = null;
let editingFolderIndex = null;

/**
 * Adds stations to the Stations page, 
 * rendering station elements based on configuration settings with pagination.
 */
function addStations() {
  const stationsContainer = $(".content-page.p-stations");
  stationsContainer.innerText = "";

  // Retrieve stations from configuration settings
  if (radioConfigs.getItem("stations")) {
    stations = radioConfigs.getItem("stations");
  }

  const start = currentStationsPage * stationsPerPage;
  const end = start + stationsPerPage;
  const paginatedStations = stations.slice(start, end);

  paginatedStations.forEach((station, i) => {
    const actualIndex = start + i;
    let active = "";
    let icon = "play";

    // Check if the current station is active
    if (radioConfigs.stationId == actualIndex) {
      active = "active";
      icon = "pause";
    }

    // If station is a favorite, add the "active" class
    let activeFav = station.favorite ? "active" : "";

    // Image handling: local folder, custom data URL, or standard station image
    let stationImgSrc = "";
    if (station.isLocalFolder) {
      if (station.image && station.image.startsWith("img/stations/")) {
        stationImgSrc = `${station.image}_.jpg`;
      } else {
        stationImgSrc = station.image || "img/stations/01.gif_.jpg";
      }
    } else if (station.image && station.image.startsWith("img/stations/")) {
      stationImgSrc = `${station.image}_.jpg`;
    } else if (station.image) {
      stationImgSrc = station.image;
    } else {
      stationImgSrc = customRadioSvgDataUrl;
    }

    // Badge icon (folder / radio)
    let typeBadge = "";
    if (station.isLocalFolder) {
      typeBadge = `<span class="station-type-badge folder-badge"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></span>`;
    } else if (station.isCustom) {
      typeBadge = `<span class="station-type-badge radio-badge"><svg viewBox="0 0 24 24"><path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h2v2zm0-4h-2V6h2v2z"/></svg></span>`;
    }

    // Action buttons (edit and delete) for custom stations / folders with crisp SVG icons and no tooltips
    let actionButtons = "";
    if (station.isCustom || station.isLocalFolder) {
      actionButtons = `
        <div class="station-actions-group">
          <div class="station-action-icon station-edit-btn" data-edit-id="${actualIndex}">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </div>
          <div class="station-action-icon station-del-btn" data-delete-id="${actualIndex}">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </div>
        </div>
      `;
    }

    let stationHTML = `
      <div class="station-wrapper sv-flex ${active}" data-id="${actualIndex}">
          <div class="station sv-flex" 
            tooltip${(actualIndex + 1) % 3 == 0 ? "-left" : ""}="${station.title}"
          >
            <img src="${stationImgSrc}" class="logo-station">
            <img src="img/controls/${icon}.png" class="play-station"/>
            <img src="img/controls/fav.png" class="fav-icon ${activeFav}"/>
            ${typeBadge}
            ${actionButtons}
          </div>
      </div>
      `;

    stationsContainer.insertAdjacentHTML("beforeend", stationHTML);
  });

  // Action Bar with Add Buttons
  const actionBarHTML = `
    <div class="stations-action-bar sv-flex">
      <button id="btn-add-station" class="stations-action-btn">
        <span class="btn-icon">+</span> Radio
      </button>
      <button id="btn-add-folder" class="stations-action-btn">
        <span class="btn-icon">+</span> Folder
      </button>
    </div>
  `;
  stationsContainer.insertAdjacentHTML("beforeend", actionBarHTML);

  // Pagination controls
  const totalPages = Math.ceil(stations.length / stationsPerPage);
  if (totalPages > 1) {
    const paginationHTML = `
      <button id="prev-page" class="nav-arrow prev" ${currentStationsPage === 0 ? "disabled" : ""}>
        <div class="arrow-icon"></div>
      </button>
      <div class="page-info-bubble">${currentStationsPage + 1}/${totalPages}</div>
      <button id="next-page" class="nav-arrow next" ${currentStationsPage === totalPages - 1 ? "disabled" : ""}>
        <div class="arrow-icon"></div>
      </button>
    `;

    stationsContainer.insertAdjacentHTML("beforeend", paginationHTML);

    $("#prev-page").onclick = (e) => {
      e.stopPropagation();
      if (currentStationsPage > 0) {
        currentStationsPage--;
        addStations();
      }
    };

    $("#next-page").onclick = (e) => {
      e.stopPropagation();
      if (currentStationsPage < totalPages - 1) {
        currentStationsPage++;
        addStations();
      }
    };
  }

  // Modals for adding/editing station & folder
  renderModalsAndEvents();

  // Play station/folder on click
  $$(".station-wrapper").forEach((stationEl) => {
    stationEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("station-action-icon")) return;
      const stationID = parseInt(stationEl.getAttribute("data-id"));
      currentStation = stationID;
      renderStation(stationID);
      addStations();
    });
  });

  // Edit station/folder button event
  $$(".station-edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const indexToEdit = parseInt(btn.getAttribute("data-edit-id"));
      const itemToEdit = stations[indexToEdit];
      if (!itemToEdit) return;

      if (itemToEdit.isLocalFolder) {
        openEditFolderModal(indexToEdit, itemToEdit);
      } else {
        openEditStationModal(indexToEdit, itemToEdit);
      }
    });
  });

  // Delete station/folder button event
  $$(".station-del-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const indexToDelete = parseInt(btn.getAttribute("data-delete-id"));
      const itemToDelete = stations[indexToDelete];
      if (!itemToDelete) return;

      const confirmed = await openModal(
        "Delete item",
        `Are you sure you want to delete "${itemToDelete.title}"?`
      );

      if (confirmed) {
        // If it was a folder, remove from IndexedDB
        if (itemToDelete.isLocalFolder && itemToDelete.id) {
          try {
            await LocalMusicDB.deleteFolder(itemToDelete.id);
          } catch (err) {
            console.error("Error deleting folder from IndexedDB:", err);
          }
        }

        // Remove from customStations array in localStorage
        let customStations = radioConfigs.getItem("customStations") || [];
        customStations = customStations.filter(cs => cs.id !== itemToDelete.id && cs.url !== itemToDelete.url);
        radioConfigs.setItem("customStations", customStations);

        // Remove from current stations
        stations.splice(indexToDelete, 1);
        radioConfigs.setItem("stations", stations);

        if (radioConfigs.stationId === indexToDelete) {
          currentStation = 0;
          renderStation(0);
        } else if (radioConfigs.stationId > indexToDelete) {
          currentStation = radioConfigs.stationId - 1;
          radioConfigs.setItem("stationId", currentStation);
        }

        const newTotalPages = Math.ceil(stations.length / stationsPerPage);
        if (currentStationsPage >= newTotalPages && currentStationsPage > 0) {
          currentStationsPage = newTotalPages - 1;
        }

        addStations();
      }
    });
  });
}

function openEditStationModal(index, station) {
  editingStationIndex = index;
  $("#modal-station-title").innerText = "Edit Custom Radio";
  $("#save-station").innerText = "Save";
  $("#custom-station-title").value = station.title || "";
  $("#custom-station-url").value = station.url || "";
  $("#modal-add-station").classList.add("active");
  $("#custom-station-title").focus();
}

function openEditFolderModal(index, folder) {
  editingFolderIndex = index;
  $("#modal-folder-title").innerText = "Edit Music Folder";
  $("#save-folder").innerText = "Save";
  $("#custom-folder-title").value = folder.title || "";
  $("#folder-input-text").innerText = `Keep existing (${folder.filesCount || 0} tracks)`;
  $("#folder-status-text").innerText = "Optional: select new folder to replace tracks, or just change title/gif";
  $("#folder-status-text").classList.remove("error");
  $("#folder-status-text").classList.add("success");
  $("#save-folder").disabled = false;

  const currentGif = folder.image || "img/stations/01.gif";
  $("#folder-gif-select").value = currentGif;
  $("#folder-gif-preview").src = `${currentGif}_.jpg`;

  $("#modal-add-folder").classList.add("active");
  $("#custom-folder-title").focus();
}

/**
 * Injects and manages the Add Station and Add Folder modal dialogs.
 */
function renderModalsAndEvents() {
  const stationsContainer = $(".content-page.p-stations");

  const modalsHTML = `
    <!-- Modal Add/Edit Station -->
    <div id="modal-add-station" class="custom-station-modal">
      <div class="modal-inner">
        <div class="modal-header">
          <span id="modal-station-title">Add Custom Radio</span>
          <button type="button" class="modal-close" id="close-modal-station">&times;</button>
        </div>
        <div class="modal-body">
          <input type="text" id="custom-station-title" placeholder="Station name (e.g. My Jazz)" maxlength="30" />
          <input type="url" id="custom-station-url" placeholder="Stream URL (http://... or https://...)" />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" id="cancel-station">Cancel</button>
          <button type="button" class="btn-save" id="save-station">Add</button>
        </div>
      </div>
    </div>

    <!-- Modal Add/Edit Folder -->
    <div id="modal-add-folder" class="custom-station-modal">
      <div class="modal-inner">
        <div class="modal-header">
          <span id="modal-folder-title">Add Music Folder</span>
          <button type="button" class="modal-close" id="close-modal-folder">&times;</button>
        </div>
        <div class="modal-body">
          <input type="text" id="custom-folder-title" placeholder="Folder name (e.g. My LoFi Beats)" maxlength="30" />
          <div class="folder-row-select">
            <label class="folder-input-label">
              <span id="folder-input-text">Choose music folder...</span>
              <input type="file" id="custom-folder-input" webkitdirectory directory multiple accept="audio/*" style="display: none;" />
            </label>
            <div class="folder-gif-picker sv-flex">
              <img id="folder-gif-preview" src="img/stations/01.gif_.jpg" class="folder-gif-thumb" />
              <select id="folder-gif-select" class="folder-gif-dropdown">
                ${Array.from({ length: 21 }, (_, i) => {
                  const num = String(i + 1).padStart(2, "0");
                  return `<option value="img/stations/${num}.gif">Gif ${num}</option>`;
                }).join("")}
              </select>
            </div>
          </div>
          <div id="folder-status-text" class="folder-status">Select a folder with audio files (mp3, wav, flac, ogg, etc.)</div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" id="cancel-folder">Cancel</button>
          <button type="button" class="btn-save" id="save-folder" disabled>Add</button>
        </div>
      </div>
    </div>
  `;

  stationsContainer.insertAdjacentHTML("beforeend", modalsHTML);

  // Open Add Station Modal
  $("#btn-add-station").onclick = (e) => {
    e.stopPropagation();
    editingStationIndex = null;
    $("#modal-station-title").innerText = "Add Custom Radio";
    $("#save-station").innerText = "Add";
    $("#custom-station-title").value = "";
    $("#custom-station-url").value = "";
    $("#modal-add-station").classList.add("active");
    $("#custom-station-title").focus();
  };

  // Close Add Station Modal
  const closeStationModal = () => {
    $("#modal-add-station").classList.remove("active");
    editingStationIndex = null;
  };
  $("#close-modal-station").onclick = closeStationModal;
  $("#cancel-station").onclick = closeStationModal;

  // Save Custom Station (Add or Update)
  $("#save-station").onclick = () => {
    const title = $("#custom-station-title").value.trim();
    const url = $("#custom-station-url").value.trim();

    if (!title || !url) {
      alert("Please enter both title and stream URL.");
      return;
    }

    let customStations = radioConfigs.getItem("customStations") || [];
    if (!Array.isArray(customStations)) customStations = [];

    if (editingStationIndex !== null) {
      // UPDATE
      const targetStation = stations[editingStationIndex];
      targetStation.title = title;
      targetStation.url = url;

      // Update in customStations
      const cIndex = customStations.findIndex(cs => cs.id === targetStation.id || cs.url === targetStation.url);
      if (cIndex !== -1) {
        customStations[cIndex].title = title;
        customStations[cIndex].url = url;
      }

      radioConfigs.setItem("customStations", customStations);
      radioConfigs.setItem("stations", stations);

      if (radioConfigs.stationId === editingStationIndex) {
        renderStation(editingStationIndex);
      }
    } else {
      // CREATE
      const newStation = {
        id: "station_" + Date.now(),
        title: title,
        url: url,
        image: customRadioSvgDataUrl,
        favorite: false,
        isCustom: true
      };

      customStations.push(newStation);
      radioConfigs.setItem("customStations", customStations);

      stations.push(newStation);
      radioConfigs.setItem("stations", stations);

      currentStationsPage = Math.ceil(stations.length / stationsPerPage) - 1;
    }

    closeStationModal();
    addStations();
  };

  // Open Add Folder Modal
  let selectedFolderFiles = [];
  $("#btn-add-folder").onclick = (e) => {
    e.stopPropagation();
    editingFolderIndex = null;
    $("#modal-folder-title").innerText = "Add Music Folder";
    $("#save-folder").innerText = "Add";
    $("#custom-folder-title").value = "";
    $("#folder-input-text").innerText = "Choose music folder...";
    $("#folder-status-text").innerText = "Select a folder with audio files";
    $("#folder-status-text").classList.remove("success", "error");
    $("#save-folder").disabled = true;
    selectedFolderFiles = [];
    $("#folder-gif-select").value = "img/stations/01.gif";
    $("#folder-gif-preview").src = "img/stations/01.gif_.jpg";
    $("#modal-add-folder").classList.add("active");
    $("#custom-folder-title").focus();
  };

  // Close Add Folder Modal
  const closeFolderModal = () => {
    $("#modal-add-folder").classList.remove("active");
    editingFolderIndex = null;
    selectedFolderFiles = [];
  };
  $("#close-modal-folder").onclick = closeFolderModal;
  $("#cancel-folder").onclick = closeFolderModal;

  // Folder GIF picker preview update
  $("#folder-gif-select").onchange = (e) => {
    const gifPath = e.target.value;
    $("#folder-gif-preview").src = `${gifPath}_.jpg`;
  };

  // Folder input change
  const folderInput = $("#custom-folder-input");
  folderInput.onchange = (e) => {
    const files = Array.from(e.target.files);
    // Filter for audio extensions
    const audioExts = [".mp3", ".wav", ".ogg", ".aac", ".flac", ".m4a", ".weba"];
    const audioFiles = files.filter(f => {
      const name = f.name.toLowerCase();
      return f.type.startsWith("audio/") || audioExts.some(ext => name.endsWith(ext));
    });

    if (audioFiles.length === 0) {
      $("#folder-status-text").innerText = "No audio files found in selected folder!";
      $("#folder-status-text").classList.add("error");
      $("#folder-status-text").classList.remove("success");
      if (editingFolderIndex === null) {
        $("#save-folder").disabled = true;
      }
      selectedFolderFiles = [];
      return;
    }

    selectedFolderFiles = audioFiles;

    // Auto-fill folder title from directory name if blank
    if (!$("#custom-folder-title").value.trim()) {
      const pathParts = audioFiles[0].webkitRelativePath ? audioFiles[0].webkitRelativePath.split("/") : [];
      if (pathParts.length > 1) {
        $("#custom-folder-title").value = pathParts[0];
      } else {
        $("#custom-folder-title").value = "Local Music";
      }
    }

    $("#folder-input-text").innerText = `Selected (${audioFiles.length} tracks)`;
    $("#folder-status-text").innerText = `Found ${audioFiles.length} audio file(s). Ready to save.`;
    $("#folder-status-text").classList.add("success");
    $("#folder-status-text").classList.remove("error");
    $("#save-folder").disabled = false;
  };

  // Save Folder (Add or Update)
  $("#save-folder").onclick = async () => {
    const title = $("#custom-folder-title").value.trim() || "My Music Folder";
    const selectedGif = $("#folder-gif-select").value || "img/stations/01.gif";

    $("#save-folder").disabled = true;
    $("#folder-status-text").innerText = "Saving to storage...";

    try {
      let customStations = radioConfigs.getItem("customStations") || [];
      if (!Array.isArray(customStations)) customStations = [];

      if (editingFolderIndex !== null) {
        // UPDATE FOLDER
        const targetFolder = stations[editingFolderIndex];
        targetFolder.title = title;
        targetFolder.image = selectedGif;

        // If new files were chosen, update IndexedDB
        if (selectedFolderFiles.length > 0) {
          const fileRecords = selectedFolderFiles.map(f => ({
            name: f.name,
            blob: f,
            type: f.type || "audio/mpeg"
          }));

          await LocalMusicDB.saveFolder({
            id: targetFolder.id,
            title: title,
            files: fileRecords
          });

          targetFolder.filesCount = selectedFolderFiles.length;
        }

        const cIndex = customStations.findIndex(cs => cs.id === targetFolder.id);
        if (cIndex !== -1) {
          customStations[cIndex].title = title;
          customStations[cIndex].image = selectedGif;
          if (selectedFolderFiles.length > 0) {
            customStations[cIndex].filesCount = selectedFolderFiles.length;
          }
        }

        radioConfigs.setItem("customStations", customStations);
        radioConfigs.setItem("stations", stations);

        if (radioConfigs.stationId === editingFolderIndex) {
          renderStation(editingFolderIndex);
        }
      } else {
        // CREATE FOLDER
        if (selectedFolderFiles.length === 0) return;
        const folderId = "folder_" + Date.now();
        
        const fileRecords = selectedFolderFiles.map(f => ({
          name: f.name,
          blob: f,
          type: f.type || "audio/mpeg"
        }));

        await LocalMusicDB.saveFolder({
          id: folderId,
          title: title,
          files: fileRecords
        });

        const newFolderStation = {
          id: folderId,
          title: title,
          url: "",
          image: selectedGif,
          favorite: false,
          isLocalFolder: true,
          filesCount: selectedFolderFiles.length
        };

        customStations.push(newFolderStation);
        radioConfigs.setItem("customStations", customStations);

        stations.push(newFolderStation);
        radioConfigs.setItem("stations", stations);

        currentStationsPage = Math.ceil(stations.length / stationsPerPage) - 1;
      }

      closeFolderModal();
      addStations();
    } catch (err) {
      console.error("Failed to save folder:", err);
      $("#folder-status-text").innerText = "Failed to save: " + err.message;
      $("#folder-status-text").classList.add("error");
      $("#save-folder").disabled = false;
    }
  };
}

// Initialize stations
addStations();

/**
 * Reloads the stations in the Stations page on clicking 
 * the station button in the navigation.
 */
$("#p-stations").addEventListener("click", () => {
  currentStationsPage = 0;
  addStations();
});
