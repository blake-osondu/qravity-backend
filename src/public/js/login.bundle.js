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

/***/ "./src/js/login.js":
/*!*************************!*\
  !*** ./src/js/login.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _services_auth_service_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/auth.service.js */ \"./src/services/auth.service.js\");\n\n\n\ndocument.getElementById('loginForm').addEventListener('submit', async (e) => {\n    e.preventDefault();\n    \n    const errorMessage = document.querySelector('.error-message');\n    errorMessage.style.display = 'none';\n\n    const email = document.getElementById('email').value;\n    const password = document.getElementById('password').value;\n    \n    try {\n        console.log(email);\n        console.log(password);\n        const response = await _services_auth_service_js__WEBPACK_IMPORTED_MODULE_0__.authService.login(email, password);\n        console.log(response);\n        if (response.error) {\n            errorMessage.textContent = reponse.error;\n            errorMessage.style.display = 'block';\n        } else if (response.success) {\n            window.location.href = response.redirect;\n        }\n    } catch (error) {\n        errorMessage.textContent = 'An error occurred. Please try again.';\n        errorMessage.style.display = 'block';\n    }\n});\n\n//# sourceURL=webpack://qravity/./src/js/login.js?");

/***/ }),

/***/ "./src/services/api.service.js":
/*!*************************************!*\
  !*** ./src/services/api.service.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   apiService: () => (/* binding */ apiService)\n/* harmony export */ });\nconst API_URL = \"MISSING_ENV_VAR\".API_BASE_URL || '/api';\n\nclass ApiService {\n  constructor() {\n    this.baseUrl = API_URL;\n  }\n\n  async getHeaders() {\n    const token = localStorage.getItem('token');\n    return {\n      'Content-Type': 'application/json',\n      ...(token && { Authorization: `Bearer ${token}` }),\n    };\n  }\n\n  async get(endpoint) {\n    const response = await fetch(`${this.baseUrl}/${endpoint}`, {\n      headers: await this.getHeaders(),\n    });\n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n\n  async post(endpoint, data) {\n    const response = await fetch(`${this.baseUrl}/${endpoint}`, {\n      method: 'POST',\n      headers: await this.getHeaders(),\n      body: JSON.stringify(data),\n    });\n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n\n  async put(endpoint, data) {\n    const response = await fetch(`${this.baseUrl}/${endpoint}`, {\n      method: 'PUT',\n      headers: await this.getHeaders(),\n      body: JSON.stringify(data),\n    });\n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n\n  async delete(endpoint) {\n    const response = await fetch(`${this.baseUrl}/${endpoint}`, {\n      method: 'DELETE',\n      headers: await this.getHeaders(),\n    });\n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n}\n\nconst apiService = new ApiService();\n\n\n//# sourceURL=webpack://qravity/./src/services/api.service.js?");

/***/ }),

/***/ "./src/services/auth.service.js":
/*!**************************************!*\
  !*** ./src/services/auth.service.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authService: () => (/* binding */ authService)\n/* harmony export */ });\n/* harmony import */ var _api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api.service */ \"./src/services/api.service.js\");\n\n\nconst authService = {\n  async login(email, password) {\n    const response = await _api_service__WEBPACK_IMPORTED_MODULE_0__.apiService.post('auth/login', { email, password });\n    console.log(response);\n    localStorage.setItem('token', response.token);\n    localStorage.setItem('user', JSON.stringify(response.user));\n    return response;\n  },\n\n  async logout() {\n    localStorage.removeItem('token');\n    localStorage.removeItem('user');\n  },\n\n  getUser() {\n    const user = localStorage.getItem('user');\n    return user ? JSON.parse(user) : null;\n  },\n\n  isAuthenticated() {\n    return !!localStorage.getItem('token');\n  }\n};\n\n\n//# sourceURL=webpack://qravity/./src/services/auth.service.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/login.js");
/******/ 	
/******/ })()
;