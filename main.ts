declare var galleryAlreadyInitialized: boolean;

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
  document.querySelectorAll<HTMLAnchorElement>("a[gallery]").forEach(decorateLink);
}

function decorateLink(a: HTMLAnchorElement) {
  if (isLinkDecorated(a)) {
    return;
  }

  a.addEventListener("click", async (event) => {
    event.preventDefault();

    const gallery = findGallery(a);

    if (gallery) {
      displayGallery(gallery);
    } else {
      await buildGallery(a);
    }
  });
}

function isLinkDecorated(a: HTMLAnchorElement): boolean {
  return a.hasAttribute("data-gallery-id");
}

function findGallery(a: HTMLAnchorElement): HTMLElement | null {
  const galleryId = a.getAttribute("data-gallery-id");

  if (!galleryId) {
    return null;
  }

  const gallery = document.getElementById(galleryId);

  return gallery;
}

function displayGallery(gallery: HTMLElement) {
  const initialDisplayValue = gallery.getAttribute("data-initial-display-value");

  if (initialDisplayValue === null) {
    console.warn("displayGallery: gallery has not been initialized.");
    return;
  }

  gallery.style.display = initialDisplayValue;
}

async function buildGallery(a: HTMLAnchorElement) {
  a.style.cursor = "progresss";

  const imageUrls = await fetch(a.href)
    .then((r) => r.text())
    .then(extractURLs(a.href));

  const images = buildImages(imageUrls);
  const scroller = addScroller(images);
  const wrapper = addWrapper(scroller);

  addCloseButton(wrapper);
  appendToPage(wrapper);

  a.setAttribute("data-gallery-id", wrapper.id);
  a.style.cursor = "pointer";
}

function appendToPage(wrapper: HTMLDivElement): HTMLDivElement {
  return document.body.appendChild(wrapper);
}

function addCloseButton(wrapper: HTMLDivElement): HTMLDivElement {
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
    textShadow: "2px 2px 5px black",
    fontSize: "2em",
    zIndex: "2"
  });

  wrapper.appendChild(closeButton);

  return wrapper;
}

function addScroller(images: HTMLImageElement[]): HTMLDivElement {
  const scroller = document.createElement("div");
  const isSafari = "safari" in window;

  setStyle(scroller, {
    overflow: "scroll",
    overscrollBehavior: "none",
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

function addWrapper(scroller: HTMLDivElement): HTMLDivElement {
  const wrapper = document.createElement("div");

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

function buildImages(urls: string[]): HTMLImageElement[] {
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

function extractURLs(baseUrl: string): (s: string) => string[] {
  return function (s) {
    const links = new DOMParser().parseFromString(s, "text/html").querySelectorAll("a");
    const urls = Array.from(links)
      .map((a) => baseUrl + "/" + a.getAttribute("href"))
      .filter((url) => !url.endsWith("/"));

    return urls;
  };
}

function setStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  Object.assign(el.style, style);
}
