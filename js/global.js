const $ = (el) => document.querySelector(el);
const $$ = (el) => document.querySelectorAll(el);

function dubbleToggle (element, className, duration = 500) {
	$(element).classList.toggle(className);
	setTimeout(() => $(element).classList.toggle(className), duration);
};

const APP_NAME = '4svLoFiRadio'