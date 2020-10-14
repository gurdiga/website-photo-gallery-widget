"use strict";
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
    if (isLinkDecorated(a)) {
        return;
    }
    a.addEventListener("click", function (event) {
        event.preventDefault();
        var gallery = findGallery(a);
        if (gallery) {
            displayGallery(gallery);
        }
        else {
            buildGallery(a);
        }
    });
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
    if (!initialDisplayValue) {
        console.warn("displayGallery: Trying to display a gallery which was not initialized.");
        return;
    }
    gallery.style.display = initialDisplayValue;
}
function buildGallery(a) {
    a.style.cursor = "progress";
    fetch(a.href)
        .then(function (r) { return r.text(); })
        .then(extractURLs(a.href))
        .then(buildImages)
        .then(addScroller)
        .then(addWrapper)
        .then(addCloseButton)
        .then(appendToPage)
        .then(function (wrapper) {
        a.setAttribute("data-gallery-id", wrapper.id);
        a.style.cursor = "pointer";
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
