declare var galleryAlreadyInitialized: boolean;
declare var runGalleryUnitTests: () => void;

const UnitTests: { [description: string]: () => void } = {};

(function () {
  document.addEventListener("DOMContentLoaded", main);
  document.addEventListener("keydown", ifKey("Escape", closeOpenedGallery));

  const WRAPPER_CLASS_NAME = "website-photo-gallery-widget";

  const ERROR_SVG_TEXT =
    'data:image/svg+xml,<svg viewBox="0 0 45 18" xmlns="http://www.w3.org/2000/svg"><text x="3" y="15" fill="red">Error!</text></svg>';
  const NO_IMAGE_TEXT =
    'data:image/svg+xml,<svg viewBox="0 0 80 18" xmlns="http://www.w3.org/2000/svg"><text x="3" y="14" fill="red">No images!</text></svg>';

  function main() {
    // This is needed because DOMContentLoaded can sometimes be triggered multiple times
    if (window["galleryAlreadyInitialized"]) {
      return;
    }

    window["galleryAlreadyInitialized"] = true;
    initialize();
  }

  function initialize() {
    findGalleryLinks().forEach(initializeLink);
  }

  function findGalleryLinks(): NodeListOf<HTMLAnchorElement> {
    return document.querySelectorAll("a[gallery]");
  }

  function initializeLink(a: HTMLAnchorElement) {
    if (isLinkInitialized(a)) {
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

  function isLinkInitialized(a: HTMLAnchorElement): boolean {
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
    const gallery = prepareGallery();

    const imageUrls = await getImageUrls(a);
    const images = createImages(imageUrls);

    addImagesToGallery(images, gallery);
    relateLinkToGallery(a, gallery);

    return gallery;
  }

  async function getImageUrls(a: HTMLAnchorElement): Promise<string[]> {
    const source = a.getAttribute("gallery") || "nginx";
    let urls: string[];

    if (source === "nginx") {
      urls = await fetch(a.href)
        .then((r) => r.text())
        .then(extractNginxURLs(a.href));
    } else if (source === "apache") {
      urls = await fetch(a.href)
        .then((r) => r.text())
        .then(extractApacheURLs(a.href));
    } else if (isInlineUrlList(source)) {
      urls = parseInlineUrlList(source);
    } else if (isCustomLoaderFunction(source)) {
      urls = await loadUrlsUsingCustomLoaderFunction(source, a);
    } else {
      console.error("Website photo gallery widget: Unrecognized source %o for link %o", source, a);

      urls = [ERROR_SVG_TEXT];
    }

    return urls.length > 0 ? urls : [NO_IMAGE_TEXT];
  }

  async function loadUrlsUsingCustomLoaderFunction(source: string, a: HTMLAnchorElement): Promise<string[]> {
    const loaderFunctionName = getCustomLoaderFunctionName(source);

    if (!loaderFunctionName) {
      return [ERROR_SVG_TEXT];
    }

    const loaderFunction = (window as any)[loaderFunctionName] as any;

    if (!loaderFunction) {
      console.error(
        `Website photo gallery widget: Custom loader function '${loaderFunctionName}' not found in the global scope`
      );
      return [ERROR_SVG_TEXT];
    }

    if (!(loaderFunction instanceof Function)) {
      console.error(
        `Website photo gallery widget: Custom loader: '${loaderFunctionName}' in the global scope is not a function`
      );
      return [ERROR_SVG_TEXT];
    }

    try {
      return (await loaderFunction(a)) as string[];
    } catch (error) {
      console.error(`Website photo gallery widget: custom loader function trew error: %o`, error);
      return [ERROR_SVG_TEXT];
    }
  }

  function getCustomLoaderFunctionName(source: string): string | undefined {
    const match = source.trim().match(/^customLoaderFunction:(\w+)$/);

    if (!match) {
      console.error(`Website photo gallery widget: Invalid custom loader function spec: '${source}'`);
      return;
    }

    const name = match[1];

    if (!name) {
      console.error(`Website photo gallery widget: Invalid custom loader function spec: missing name`);
      return;
    }

    return name;
  }

  function isCustomLoaderFunction(source: string): boolean {
    return /^customLoaderFunction:\w+$/.test(source.trim());
  }

  addUnitTests("isCustomLoaderFunction", () => {
    console.assert(!isCustomLoaderFunction(""), "empty string is not");
    console.assert(!isCustomLoaderFunction("customLoaderFunction:"), "'isCustomLoaderFunction:' is not");
    console.assert(
      isCustomLoaderFunction("customLoaderFunction:LoadMyPhotos"),
      "isCustomLoaderFunction:LoadMyPhotos is"
    );
  });

  function isInlineUrlList(source: string): boolean {
    return /^https?:\//.test(source.trim());
  }

  addUnitTests("isInlineUrlList", () => {
    console.assert(!isInlineUrlList(""), "empty string is not");
    console.assert(isInlineUrlList("http://something"), "http://something is");
    console.assert(isInlineUrlList("https://something"), "https://something is");
  });

  function parseInlineUrlList(source: string): string[] {
    return source.trim().split(/[\s]+/);
  }

  addUnitTests("parseInlineUrlList", () => {
    const parsed = parseInlineUrlList(`
      http://url1  
      http://url2  `);

    console.assert(parsed.length === 2, "2 items");
    console.assert(parsed[0] === "http://url1", "http://url1");
    console.assert(parsed[1] === "http://url2", "http://url2");
  });

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

  function addImagesToGallery(images: HTMLImageElement[], gallery: HTMLDivElement): void {
    const scroller = gallery.firstElementChild!;

    images.forEach((image) => {
      scroller.appendChild(image);
    });
  }

  function addWrapperToPage(wrapper: HTMLDivElement): HTMLDivElement {
    return document.body.appendChild(wrapper);
  }

  function createCloseButtonForWrapper(wrapper: HTMLDivElement): HTMLButtonElement {
    const closeButton = document.createElement("button");

    closeButton.textContent = document.characterSet === "UTF-8" ? "×" : "x";
    closeButton.addEventListener("click", () => closeGallery(wrapper));

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

  function closeGallery(wrapper: HTMLDivElement): void {
    wrapper.setAttribute("data-initial-display-value", wrapper.style.display);
    wrapper.style.display = "none";
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
    wrapper.className = WRAPPER_CLASS_NAME;

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
      image.alt = `Image: ${basename(url)}`;

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

  function basename(url: string): string {
    const happyPath = url.replace(/.*\//, "").replace(/\..*$/, "");
    const fallback = url.replace(/.*\//, "");

    return happyPath || fallback;
  }

  addUnitTests("basename", () => {
    console.assert(basename("http://host/birthday.jpg") === "birthday", "happy path");
  });

  function extractNginxURLs(baseUrl: string): (s: string) => string[] {
    return function (s) {
      const links = new DOMParser().parseFromString(s, "text/html").querySelectorAll("a");
      const urls = Array.from(links)
        .map((a) => baseUrl + "/" + a.getAttribute("href"))
        .filter((url) => !url.endsWith("/"));

      return urls;
    };
  }

  function extractApacheURLs(baseUrl: string): (s: string) => string[] {
    return function (s) {
      const links = new DOMParser().parseFromString(s, "text/html").querySelectorAll("a");

      const extractHref = (a: HTMLAnchorElement) => a.getAttribute("href")!;
      const excludeParentDirectoryLink = (href: string) => !href.endsWith("/");
      const excludeOrderLinks = (href: string) => !href.startsWith("?");
      const fullUrl = (href: string) => baseUrl + "/" + href;

      const urls = Array.from(links)
        .map(extractHref)
        .filter(excludeParentDirectoryLink)
        .filter(excludeOrderLinks)
        .map(fullUrl);

      return urls;
    };
  }

  function setStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
    Object.assign(el.style, style);
  }

  function closeOpenedGallery() {
    const gallery = findOpenGallery();

    if (!gallery) {
      return;
    }

    closeGallery(gallery);
  }

  function findOpenGallery(): HTMLDivElement | undefined {
    const galleries: NodeListOf<HTMLDivElement> = document.querySelectorAll(`.${WRAPPER_CLASS_NAME}`);
    const isNotHidden = (div: HTMLDivElement) => div.style.display !== "none";
    const gallery = Array.from(galleries).find(isNotHidden);

    return gallery;
  }

  function ifKey(keyName: string, handler: (event?: KeyboardEvent) => void) {
    return (event: KeyboardEvent) => {
      if (event.key === keyName) handler(event);
    };
  }

  // Unit tests infrastructure

  function addUnitTests(description: string, f: () => void) {
    UnitTests[description] = () => {
      console.group(description);
      f();
      console.log("OK");
      console.groupEnd();
    };
  }

  window.runGalleryUnitTests = () => {
    for (const description in UnitTests) {
      UnitTests[description]();
    }
  };

  const isDevelopment = ["127.0.0.1", "localhost"].includes(location.hostname);

  if (isDevelopment) {
    window.runGalleryUnitTests();
  }
})();
