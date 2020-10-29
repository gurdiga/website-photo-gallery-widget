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
  findGalleryLinks().forEach(decorateLink);
}

function findGalleryLinks(): NodeListOf<HTMLAnchorElement> {
  return document.querySelectorAll("a[gallery]");
}

function decorateLink(a: HTMLAnchorElement) {
  if (isLinkDecorated(a)) {
    return;
  }

  a.addEventListener("click", async (event) => {
    event.preventDefault();

    const gallery = findGalleryForLink(a);

    if (gallery) {
      displayExistingGallery(gallery);
    } else {
      await buildGallery(a);
    }
  });
}

function isLinkDecorated(a: HTMLAnchorElement): boolean {
  return a.hasAttribute("data-gallery-id");
}

function findGalleryForLink(a: HTMLAnchorElement): HTMLElement | null {
  const galleryId = a.getAttribute("data-gallery-id");

  if (!galleryId) {
    return null;
  }

  const gallery = document.getElementById(galleryId);

  return gallery;
}

function displayExistingGallery(gallery: HTMLElement) {
  const initialDisplayValue = gallery.getAttribute("data-initial-display-value");

  if (initialDisplayValue === null) {
    console.warn("displayGallery: gallery has not been initialized.");
    return;
  }

  gallery.style.display = initialDisplayValue;
}

async function buildGallery(a: HTMLAnchorElement) {
  withProgressIndicator(a, async () => {
    const gallery = prepareGallery();

    const imageUrls = await getImageUrls(a);
    const images = createImages(imageUrls);

    addImagesToGallery(images, gallery);
    relateLinkToGallery(a, gallery);

    return gallery;
  });
}

async function getImageUrls(a: HTMLAnchorElement): Promise<string[]> {
  return await fetch(a.href)
    .then((r) => r.text())
    .then(extractURLs(a.href));
}

function prepareGallery(): HTMLDivElement {
  const wrapper = createWrapper();
  const scroller = createScroller();
  const closeButton = createCloseButtonForWrapper(wrapper);
  const spinner = createSpinner();

  scroller.appendChild(spinner);
  wrapper.appendChild(scroller);
  wrapper.appendChild(closeButton);

  return addWrapperToPage(wrapper);
}

function createSpinner(): HTMLElement {
  const spinner = document.createElement("div");
  const className = `gallery-spinner-${Date.now()}`;

  spinner.innerText = "Loading images…";
  spinner.className = className;

  setStyle(spinner, {
    color: "white",
    width: "100%",
    textAlign: "center"
  });

  spinner.insertAdjacentHTML("afterbegin", `<style>.${className}:not(:only-child) { display: none; }</style>`);

  return spinner;
}

function sleep(seconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

function relateLinkToGallery(a: HTMLAnchorElement, gallery: HTMLDivElement): void {
  a.setAttribute("data-gallery-id", gallery.id);
}

function withProgressIndicator(a: HTMLAnchorElement, f: () => void) {
  const initialCursor = a.style.cursor;

  a.style.cursor = "progress";
  f();
  a.style.cursor = initialCursor;
}

function addImagesToGallery(images: HTMLImageElement[], gallery: HTMLDivElement): void {
  const scoller = gallery.firstElementChild!;

  images.forEach((image) => {
    scoller.appendChild(image);
  });
}

function addWrapperToPage(wrapper: HTMLDivElement): HTMLDivElement {
  return document.body.appendChild(wrapper);
}

function createCloseButtonForWrapper(wrapper: HTMLDivElement): HTMLButtonElement {
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

  return closeButton;
}

function createScroller(): HTMLDivElement {
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

  return scroller;
}

function createWrapper(): HTMLDivElement {
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

  return wrapper;
}

function createImages(urls: string[]): HTMLImageElement[] {
  return urls.map((url) => {
    const image = document.createElement("img");

    image.src = url;
    image.loading = "lazy";

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
