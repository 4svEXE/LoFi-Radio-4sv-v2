"use strict";

class SimpleModal {
  constructor(
    modalTitle = "Dialog",
    modalText = "Are you sure you want to do this?",
    acceptText = "Yes",
    cancelText = "No"
  ) {
    this.modalTitle = modalTitle;
    this.modalText = modalText;
    this.acceptText = acceptText;
    this.cancelText = cancelText;
    this.parent = document.body;
    this.modal = undefined;
    this.acceptButton = undefined;
    this.cancelButton = undefined;
    this.closeButton = undefined;

    this._createModal();
  }

  async question() {
    return new Promise((resolve, reject) => {
      if (
        !this.modal ||
        !this.acceptButton ||
        !this.cancelButton ||
        !this.closeButton
      ) {
        reject("There was a problem creating the modal window!");
        return;
      }

      this.acceptButton.focus();

      const handleButtonClick = (result) => {
        playSound(s_button);
        resolve(result);
        this._destroyModal();
      };

      this.acceptButton.addEventListener("click", () =>
        handleButtonClick(true)
      );
      this.cancelButton.addEventListener("click", () =>
        handleButtonClick(false)
      );
      this.closeButton.addEventListener("click", () => handleButtonClick(null));
    });
  }

  _createModal() {
    // Background dialog
    this.modal = document.createElement("dialog");
    this.modal.classList.add("thin-ui-modal-dialog");
    this.modal.show();

    // Message window
    const window = document.createElement("div");
    window.classList.add("thin-ui-modal-window");
    this.modal.appendChild(window);

    // Title
    const title = document.createElement("div");
    title.classList.add("thin-ui-modal-title");
    window.appendChild(title);

    // Title text
    const titleText = document.createElement("div");
    titleText.textContent = this.modalTitle;
    title.appendChild(titleText);

    // Close
    this.closeButton = document.createElement("button");
    this.closeButton.type = "button";
    this.closeButton.innerHTML = "&times;";
    this.closeButton.classList.add("thin-ui-modal-close");
    title.appendChild(this.closeButton);

    // Main text
    const text = document.createElement("div");
    text.classList.add("thin-ui-modal-text");
    text.textContent = this.modalText;
    window.appendChild(text);

    // Accept and cancel button group
    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("thin-ui-modal-button-group");
    window.appendChild(buttonGroup);

    // Cancel button
    this.cancelButton = this._createButton(
      "thin-ui-button thin-ui-button-secondary thin-ui-button-regular",
      this.cancelText
    );
    buttonGroup.appendChild(this.cancelButton);

    // Accept button
    this.acceptButton = this._createButton(
      "thin-ui-button thin-ui-button-primary thin-ui-button-regular",
      this.acceptText
    );
    buttonGroup.appendChild(this.acceptButton);

    // Let's rock
    this.parent.appendChild(this.modal);
  }

  _destroyModal() {
    this.parent.removeChild(this.modal);
    // No need to delete 'this' as it's not causing any memory leak
  }

  _createButton(classes, textContent) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add(...classes.split(" "));
    button.textContent = textContent;
    return button;
  }
}

async function openModal(title, message, yes = "Yes", no = "No") {
  playSound(s_modal);
  const myModal = new SimpleModal(title, message, yes, no);
  try {
    return await myModal.question();
  } catch (err) {
    console.log(err);
  }
}
