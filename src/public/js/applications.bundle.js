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

/***/ "./src/js/applications.js":
/*!********************************!*\
  !*** ./src/js/applications.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _services_applications_service_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/applications.service.js */ \"./src/services/applications.service.js\");\n\n\n// State management\nlet currentApplications = [];\nconst ITEMS_PER_PAGE = 10;\nlet currentPage = 1;\nlet refreshInterval;\n\n\n    // Main functions\n    async function loadApplications() {\n        try {\n            showLoadingStates();\n            const applications = await _services_applications_service_js__WEBPACK_IMPORTED_MODULE_0__.applicationsService.getAllApplications();\n            currentApplications = applications;\n            \n            if (!applications || applications.length === 0) {\n                showEmptyState();\n                return;\n            }\n            \n            updateStatistics(applications);\n            updateApplicationsTable(applications);\n            updatePagination(applications.length);\n            \n        } catch (error) {\n            console.error('Error loading applications:', error);\n            showError('Failed to load applications');\n        }\n    }\n\n    function setupEventListeners() {\n\n        setTimeout(setupSearch, 3000);\n        setTimeout(setupStatusFilter, 3000);\n        setTimeout(setupApplicationForm, 3000);\n    }\n\n    function startAutoRefresh(interval) {\n        stopAutoRefresh();\n        refreshInterval = setInterval(loadApplications, interval);\n    }\n\n    function stopAutoRefresh() {\n        if (refreshInterval) {\n            clearInterval(refreshInterval);\n        }\n    }\n\n    // UI Update functions\n    function showLoadingStates() {\n        document.querySelectorAll('.stats-card h2').forEach(el => {\n            el.innerHTML = '<div class=\"spinner-border spinner-border-sm\"></div>';\n        });\n        //not sure what this intented to do\n        // document.querySelector('#applicationsTableBody').innerHTML = createLoadingRow(7);\n    }\n\n    function showEmptyState() {\n\n    }\n\n    function updateStatistics(applications) {\n        const stats = calculateStats(applications);\n        updateStatsDisplay(stats);\n    }\n\n    function updateApplicationsTable(applications) {\n        const tableBody = document.querySelector('#applicationsTableBody');\n        const paginatedApps = paginateApplications(applications);\n        \n        if (paginatedApps.length === 0) {\n            tableBody.innerHTML = createEmptyRow();\n            return;\n        }\n        \n        tableBody.innerHTML = paginatedApps.map(createApplicationRow).join('');\n        updatePaginationInfo(applications.length);\n    }\n\n    // Event Listeners\n    function setupSearch() {\n       \n        console.log('will setup search');\n\n        function performUpdates() {\n            setTimeout(() => {\n                const searchTerm = searchInput.value.toLowerCase();\n                const filtered = filterApplications(searchTerm);\n                updateApplicationsTable(filtered);\n                updatePagination(filtered.length);\n            }, 300);\n        }\n\n        const searchInput = document.getElementById('applicationSearch');\n        searchInput.addEventListener('input', performUpdates);\n    }\n\n    function setupStatusFilter() {\n        console.log('will set up status filter');\n        document.querySelector('.dropdown-menu').addEventListener('click', (e) => {\n            if (e.target.matches('[data-filter]')) {\n                e.preventDefault();\n                const filter = e.target.dataset.filter;\n                const filtered = filterByStatus(filter);\n                updateApplicationsTable(filtered);\n                updatePagination(filtered.length);\n            }\n        });\n    }\n\n    function setupApplicationForm() {\n        console.log('will set up application form');\n        const saveButton = document.getElementById('saveApplication');\n        if (!saveButton) return;\n\n        saveButton.addEventListener('click', handleApplicationSubmit);\n    }\n\n    // Helper functions\n    function showNotification(message, type = 'success') {\n        const toast = document.getElementById('notification-toast');\n        const toastBody = toast.querySelector('.toast-body');\n        toast.className = `toast bg-${type} text-white`;\n        toastBody.textContent = message;\n        new bootstrap.Toast(toast).show();\n    }\n\n    function showError(message) {\n        showNotification(message, 'danger');\n    }\n\n\n\n\n\n    loadApplications();\n    setupEventListeners();\n    // startAutoRefresh(30000); // Refresh every 30 seconds\n\n\n//# sourceURL=webpack://qravity/./src/js/applications.js?");

/***/ }),

/***/ "./src/services/api.service.js":
/*!*************************************!*\
  !*** ./src/services/api.service.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   apiService: () => (/* binding */ apiService)\n/* harmony export */ });\nconst API_URL = \"MISSING_ENV_VAR\".API_BASE_URL || '/api';\n\nclass ApiService {\n  constructor() {\n    this.baseUrl = API_URL;\n  }\n\n  async getHeaders() {\n    const token = localStorage.getItem('token');\n    return {\n      'Content-Type': 'application/json',\n      ...(token && { Authorization: `Bearer ${token}` }),\n    };\n  }\n\n  async get(endpoint) {\n    const response = await fetch(`${this.baseUrl}/${endpoint}`, {\n      headers: await this.getHeaders(),\n    });\n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n\n  async post(endpoint, data) {\n    const response = await fetch(`${this.baseUrl}/${endpoint}`, {\n      method: 'POST',\n      headers: await this.getHeaders(),\n      body: JSON.stringify(data),\n    });\n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n\n  async put(endpoint, data) {\n    const response = await fetch(`${this.baseUrl}/${endpoint}`, {\n      method: 'PUT',\n      headers: await this.getHeaders(),\n      body: JSON.stringify(data),\n    });\n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n\n  async delete(endpoint) {\n    const response = await fetch(`${this.baseUrl}/${endpoint}`, {\n      method: 'DELETE',\n      headers: await this.getHeaders(),\n    });\n    if (!response.ok) throw new Error('API request failed');\n    return response.json();\n  }\n}\n\nconst apiService = new ApiService();\n\n\n//# sourceURL=webpack://qravity/./src/services/api.service.js?");

/***/ }),

/***/ "./src/services/applications.service.js":
/*!**********************************************!*\
  !*** ./src/services/applications.service.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   applicationsService: () => (/* binding */ applicationsService)\n/* harmony export */ });\n/* harmony import */ var _api_service_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api.service.js */ \"./src/services/api.service.js\");\n\n\nconst applicationsService = {\n  async getAllApplications() {\n    try {\n      return await _api_service_js__WEBPACK_IMPORTED_MODULE_0__.apiService.get('applications');\n    } catch (error) {\n      console.error('Error fetching applications:', error);\n      throw error;\n    }\n  },\n\n  async getApplicationById(id) {\n    try {\n      return await _api_service_js__WEBPACK_IMPORTED_MODULE_0__.apiService.get(`applications/${id}`);\n    } catch (error) {\n      console.error('Error fetching application:', error);\n      throw error;\n    }\n  },\n\n  async updateApplication(id, data) {\n    try {\n      return await _api_service_js__WEBPACK_IMPORTED_MODULE_0__.apiService.put(`applications/${id}`, data);\n    } catch (error) {\n      console.error('Error updating application:', error);\n      throw error;\n    }\n  },\n\n  async deleteApplication(id) {\n    try {\n      return await _api_service_js__WEBPACK_IMPORTED_MODULE_0__.apiService.delete(`applications/${id}`);\n    } catch (error) {\n      console.error('Error deleting application:', error);\n      throw error;\n    }\n  },\n\n  async createApplication(data) {\n    try {\n      return await _api_service_js__WEBPACK_IMPORTED_MODULE_0__.apiService.post('applications', data);\n    } catch (error) {\n      console.error('Error creating application:', error);\n      throw error;\n    }\n  }\n}; \n\n//# sourceURL=webpack://qravity/./src/services/applications.service.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/applications.js");
/******/ 	
/******/ })()
;