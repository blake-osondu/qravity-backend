/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/preferences.js":
/*!*******************************!*\
  !*** ./src/js/preferences.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadPreferences: () => (/* binding */ loadPreferences),\n/* harmony export */   setupEventListeners: () => (/* binding */ setupEventListeners),\n/* harmony export */   showError: () => (/* binding */ showError),\n/* harmony export */   showNotification: () => (/* binding */ showNotification)\n/* harmony export */ });\n// import { preferencesService } from '../services/preferences.service.js';\n\nlet currentPreferences = null;\nlet hasUnsavedChanges = false;\n\nasync function loadPreferences() {\n    try {\n        showLoadingState(true);\n        const preferences = await preferencesService.getPreferences();\n        currentPreferences = preferences;\n        updateFormWithPreferences(preferences);\n        hasUnsavedChanges = false;\n        updateSaveButton();\n    } catch (error) {\n        console.error('Error loading preferences:', error);\n        showError('Failed to load preferences');\n    } finally {\n        showLoadingState(false);\n    }\n}\n\nfunction setupEventListeners() {\n    const form = document.getElementById('preferencesForm');\n    \n    // Track changes on all form inputs\n    form.querySelectorAll('input, select').forEach(input => {\n        input.addEventListener('change', () => {\n            hasUnsavedChanges = true;\n            updateSaveButton();\n        });\n    });\n\n    // Save button handler\n    document.getElementById('savePreferences').addEventListener('click', savePreferences);\n}\n\nasync function savePreferences() {\n    const saveButton = document.getElementById('savePreferences');\n    try {\n        saveButton.disabled = true;\n        saveButton.innerHTML = '<i class=\"bi bi-hourglass me-2\"></i>Saving...';\n\n        const preferences = getFormData();\n        await preferencesService.updatePreferences(preferences);\n        \n        currentPreferences = preferences;\n        hasUnsavedChanges = false;\n        updateSaveButton();\n        showNotification('Preferences saved successfully');\n    } catch (error) {\n        console.error('Error saving preferences:', error);\n        showError('Failed to save preferences');\n    } finally {\n        saveButton.disabled = false;\n        saveButton.innerHTML = '<i class=\"bi bi-save me-2\"></i>Save Changes';\n    }\n}\n\nfunction getFormData() {\n    return {\n        jobTypes: {\n            fullTime: document.getElementById('fullTime').checked,\n            contract: document.getElementById('contract').checked,\n            remote: document.getElementById('remote').checked,\n            hybrid: document.getElementById('hybrid').checked\n        },\n        location: {\n            preferred: document.querySelector('input[placeholder=\"Add locations (comma-separated)\"]')\n                .value.split(',').map(loc => loc.trim()).filter(Boolean),\n            maxDistance: parseInt(document.querySelector('.form-select').value)\n        },\n        salary: {\n            min: parseInt(document.querySelector('input[value=\"80000\"]').value),\n            max: parseInt(document.querySelector('input[value=\"120000\"]').value)\n        },\n        keywords: {\n            include: document.querySelector('input[placeholder=\"Required keywords (comma-separated)\"]')\n                .value.split(',').map(kw => kw.trim()).filter(Boolean),\n            exclude: document.querySelector('input[placeholder=\"Keywords to avoid (comma-separated)\"]')\n                .value.split(',').map(kw => kw.trim()).filter(Boolean)\n        }\n    };\n}\n\nfunction updateFormWithPreferences(preferences) {\n    // Job Types\n    document.getElementById('fullTime').checked = preferences.jobTypes.fullTime;\n    document.getElementById('contract').checked = preferences.jobTypes.contract;\n    document.getElementById('remote').checked = preferences.jobTypes.remote;\n    document.getElementById('hybrid').checked = preferences.jobTypes.hybrid;\n\n    // Location\n    document.querySelector('input[placeholder=\"Add locations (comma-separated)\"]')\n        .value = preferences.location.preferred.join(', ');\n    document.querySelector('.form-select').value = preferences.location.maxDistance;\n\n    // Salary\n    document.querySelector('input[value=\"80000\"]').value = preferences.salary.min;\n    document.querySelector('input[value=\"120000\"]').value = preferences.salary.max;\n\n    // Keywords\n    document.querySelector('input[placeholder=\"Required keywords (comma-separated)\"]')\n        .value = preferences.keywords.include.join(', ');\n    document.querySelector('input[placeholder=\"Keywords to avoid (comma-separated)\"]')\n        .value = preferences.keywords.exclude.join(', ');\n}\n\nfunction updateSaveButton() {\n    const saveButton = document.getElementById('savePreferences');\n    saveButton.disabled = !hasUnsavedChanges;\n}\n\nfunction showLoadingState(isLoading) {\n    const form = document.getElementById('preferencesForm');\n    const saveButton = document.getElementById('savePreferences');\n    \n    form.querySelectorAll('input, select').forEach(input => {\n        input.disabled = isLoading;\n    });\n    \n    saveButton.disabled = isLoading;\n}\n\nfunction showNotification(message, type = 'success') {\n    const toast = document.getElementById('notification-toast');\n    const toastBody = toast.querySelector('.toast-body');\n    toast.className = `toast bg-${type} text-white`;\n    toastBody.textContent = message;\n    new bootstrap.Toast(toast).show();\n}\n\nfunction showError(message) {\n    showNotification(message, 'danger');\n} \n\n//# sourceURL=webpack://qravity/./src/js/preferences.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/preferences.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;