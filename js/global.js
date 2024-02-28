/**
 * The name of the application.
 * @type {string}
 */
const APP_NAME = '4svLoFiRadio';

/**
 * Selects a single DOM element.
 * @function
 * @param {string} el - The CSS selector of the element to select.
 * @returns {Element} - The selected DOM element.
 */
const $ = (el) => document.querySelector(el);

/**
 * Selects multiple DOM elements.
 * @function
 * @param {string} el - The CSS selector of the elements to select.
 * @returns {NodeList} - A NodeList containing all selected DOM elements.
 */
const $$ = (el) => document.querySelectorAll(el);

/**
 * Toggles a class on an element and reverts the toggle after a specified duration.
 * @function
 * @param {string} element - The CSS selector of the element to toggle the class on.
 * @param {string} className - The class to toggle.
 * @param {number} [duration=500] - The duration (in milliseconds) for which the class should be toggled before reverting.
 */
function dubbleToggle(element, className, duration = 500) {
  const toggleClass = (element, className) => {
    element.classList.toggle(className);
  };
  toggleClass($(element), className);

  // Sets a timeout to revert the class after the specified duration
  setTimeout(() => toggleClass($(element), className), duration);
}
