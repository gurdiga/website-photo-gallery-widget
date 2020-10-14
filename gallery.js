// @ts-check

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

/**
 * @param {HTMLAnchorElement} a
 * @returns {void}
 */
function decorateLink(a) {
  if (isLinkDecorated(a)) {
    return;
  }

  a.addEventListener("click", function (event) {
    event.preventDefault();

    const gallery = findGallery(a);

    if (gallery) {
      displayGallery(gallery);
    } else {
      buildGallery(a);
    }
  });
}

/**
 * @param {HTMLAnchorElement} a
 * @returns {boolean}
 */
function isLinkDecorated(a) {
  return a.hasAttribute("data-gallery-id");
}

/**
 * @param {HTMLAnchorElement} a
 * @returns {HTMLElement}
 */
function findGallery(a) {
  const galleryId = a.getAttribute("data-gallery-id");
  const gallery = document.getElementById(galleryId);

  return gallery;
}

/**
 * @param {HTMLElement} gallery
 * @returns {void}
 */
function displayGallery(gallery) {
  const initialDisplayValue = gallery.getAttribute("data-initial-display-value");

  gallery.style.display = initialDisplayValue;
}

/**
 * @param {HTMLAnchorElement} a
 * @returns {void}
 */
function buildGallery(a) {
  a.style.cursor = "progress";

  fetch(a.href)
    .then((r) => r.text())
    .then(extractURLs(a.href))
    .then(buildImages)
    .then(addScroller)
    .then(addWrapper)
    .then(addCloseButton)
    .then(appendToPage)
    .then((wrapper) => {
      a.setAttribute("data-gallery-id", wrapper.id);
      a.style.cursor = "pointer";
    });
}

/**
 * @param {HTMLDivElement} wrapper
 * @returns {HTMLDivElement}
 */
function appendToPage(wrapper) {
  return document.body.appendChild(wrapper);
}

/**
 * @param {HTMLDivElement} wrapper
 * @returns {HTMLDivElement}
 */
function addCloseButton(wrapper) {
  const closeButton = document.createElement("button");

  closeButton.textContent = document.characterSet === "UTF-8" ? "×" : "x";
  closeButton.addEventListener("click", () => {
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
    fontSize: "2em",
    zIndex: "2"
  });

  wrapper.appendChild(closeButton);

  return wrapper;
}

/**
 * @param {HTMLImageElement[]} images
 * @returns {HTMLDivElement}
 */
function addScroller(images) {
  const scroller = document.createElement("div");
  const isSafari = "safari" in window;

  setStyle(scroller, {
    overflow: "scroll",
    display: "flex",
    alignItems: "center",
    background: `rgba(0, 0, 0, ${isSafari ? 0.5 : 0.75})`,
    height: "100%"
  });

  images.forEach((image) => {
    scroller.appendChild(image);
  });

  return scroller;
}

/**
 * @param {HTMLDivElement} scroller
 * @returns {HTMLDivElement}
 */
function addWrapper(scroller) {
  const wrapper = document.createElement("div");

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

/**
 * @param {string[]} urls
 * @returns {HTMLImageElement[]}
 */
function buildImages(urls) {
  return urls.map((url) => {
    const image = document.createElement("img");

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

/**
 * @param {string} baseUrl
 * @returns {(s: string) => string[]}
 */
function extractURLs(baseUrl) {
  return function (s) {
    const links = new DOMParser().parseFromString(s, "text/html").querySelectorAll("a");
    const urls = Array.from(links)
      .map((a) => baseUrl + "/" + a.getAttribute("href"))
      .filter((url) => !url.endsWith("/"));

    return urls;
  };
}

/**
 * @param {HTMLElement} el
 * @param {Partial<CSSStyleDeclaration>} style
 * @returns {void};
 */
function setStyle(el, style) {
  Object.assign(el.style, style);
}
