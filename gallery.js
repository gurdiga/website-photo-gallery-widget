"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
window.addEventListener("DOMContentLoaded", main);
function main() {
    // This is needed because DOMContentLoaded can sometimes be triggered multiple times
    if (window["galleryAlreadyInitialized"]) {
        return;
    }
    window["galleryAlreadyInitialized"] = true;
    initialize();
}
function initialize() {
    document.querySelectorAll("a[gallery]").forEach(decorateLink);
}
function decorateLink(a) {
    var _this = this;
    if (isLinkDecorated(a)) {
        return;
    }
    a.addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
        var gallery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    gallery = findGallery(a);
                    if (!gallery) return [3 /*break*/, 1];
                    displayGallery(gallery);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, buildGallery(a)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
function isLinkDecorated(a) {
    return a.hasAttribute("data-gallery-id");
}
function findGallery(a) {
    var galleryId = a.getAttribute("data-gallery-id");
    if (!galleryId) {
        return null;
    }
    var gallery = document.getElementById(galleryId);
    return gallery;
}
function displayGallery(gallery) {
    var initialDisplayValue = gallery.getAttribute("data-initial-display-value");
    if (initialDisplayValue === null) {
        console.warn("displayGallery: gallery has not been initialized.");
        return;
    }
    gallery.style.display = initialDisplayValue;
}
function buildGallery(a) {
    return __awaiter(this, void 0, void 0, function () {
        var imageUrls, images, scroller, wrapper;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    a.style.cursor = "progresss";
                    return [4 /*yield*/, fetch(a.href)
                            .then(function (r) { return r.text(); })
                            .then(extractURLs(a.href))];
                case 1:
                    imageUrls = _a.sent();
                    images = buildImages(imageUrls);
                    scroller = addScroller(images);
                    wrapper = addWrapper(scroller);
                    addCloseButton(wrapper);
                    appendToPage(wrapper);
                    a.setAttribute("data-gallery-id", wrapper.id);
                    a.style.cursor = "pointer";
                    return [2 /*return*/];
            }
        });
    });
}
function appendToPage(wrapper) {
    return document.body.appendChild(wrapper);
}
function addCloseButton(wrapper) {
    var closeButton = document.createElement("button");
    closeButton.textContent = document.characterSet === "UTF-8" ? "×" : "x";
    closeButton.addEventListener("click", function () {
        wrapper.setAttribute("data-initial-display-value", wrapper.style.display);
        wrapper.style.display = "none";
    });
    setStyle(closeButton, {
        position: "fixed",
        top: "0",
        right: "0",
        background: "transparent",
        border: "none",
        padding: "0.2em 0.5em",
        color: "white",
        textShadow: "2px 2px 5px black",
        fontSize: "2em",
        zIndex: "2"
    });
    wrapper.appendChild(closeButton);
    return wrapper;
}
function addScroller(images) {
    var scroller = document.createElement("div");
    var isSafari = "safari" in window;
    setStyle(scroller, {
        overflow: "scroll",
        overscrollBehavior: "none",
        display: "flex",
        alignItems: "center",
        background: "rgba(0, 0, 0, " + (isSafari ? 0.5 : 0.75) + ")",
        height: "100%"
    });
    images.forEach(function (image) {
        scroller.appendChild(image);
    });
    return scroller;
}
function addWrapper(scroller) {
    var wrapper = document.createElement("div");
    // This is used to relate links and galleries.
    wrapper.id = "gallery-" + Date.now();
    setStyle(wrapper, {
        position: "fixed",
        top: "0",
        left: "0",
        height: "100vh",
        width: "100vw",
        zIndex: "99999"
    });
    wrapper.appendChild(scroller);
    return wrapper;
}
function buildImages(urls) {
    return urls.map(function (url) {
        var image = document.createElement("img");
        image.src = url;
        setStyle(image, {
            flexShrink: "0",
            margin: "1em",
            maxHeight: "calc(100vh - 1em * 2)",
            maxWidth: "calc(100vw - 1em * 2)",
            boxSizing: "border-box",
            border: "3px solid silver",
            zIndex: "1"
        });
        return image;
    });
}
function extractURLs(baseUrl) {
    return function (s) {
        var links = new DOMParser().parseFromString(s, "text/html").querySelectorAll("a");
        var urls = Array.from(links)
            .map(function (a) { return baseUrl + "/" + a.getAttribute("href"); })
            .filter(function (url) { return !url.endsWith("/"); });
        return urls;
    };
}
function setStyle(el, style) {
    Object.assign(el.style, style);
}
