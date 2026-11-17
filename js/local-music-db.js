/**
 * IndexedDB storage helper for 4sv LoFi Radio local folders.
 * Stores audio files (Blobs) safely with persistence across sessions.
 */
const LocalMusicDB = {
  dbName: '4svLoFiRadioLocalMusic',
  dbVersion: 1,
  storeName: 'folders',

  /**
   * Opens the IndexedDB instance.
   * @returns {Promise<IDBDatabase>}
   */
  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  },

  /**
   * Saves or updates a music folder with its files.
   * @param {Object} folderData - { id, title, image, isLocalFolder: true, files: [{ name, blob, type }] }
   * @returns {Promise<void>}
   */
  async saveFolder(folderData) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(folderData);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  },

  /**
   * Retrieves a folder by its ID.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getFolder(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  /**
   * Deletes a folder by its ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteFolder(id) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  },

  /**
   * Retrieves all stored folder summaries (excluding heavy blobs if needed, or all).
   * @returns {Promise<Array<Object>>}
   */
  async getAllFolders() {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  }
};

