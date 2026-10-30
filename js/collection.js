/* =========================================================
   CHARACTER GRID BACKGROUND
========================================================= */

const baseCanvas = document.querySelector("#character-base");
const hoverCanvas = document.querySelector("#character-hover");

const baseCtx = baseCanvas.getContext("2d");
const hoverCtx = hoverCanvas.getContext("2d");

const characters = [
    "A", "B", "C", "D", "E", "F", "G",
    "O", "U", "X", "+", "*", "/", "0",
    "1", "2", "3", "#", "%", "&"
];

let spacingX;
let spacingY;
let characterSize;

let pageWidth;
let pageHeight;
let dpr;

let mouseX = -1000;
let mouseY = -1000;

let characterMap = [];

/* =========================================================
   EMBEDDED TEXT
========================================================= */

const embeddedText = [

    {
        text: "01 / 04",
        anchor: "body",
        anchorPoint: "top-left",
        offsetX: 2,
        offsetY: 10
    },

    {
        text: "01 / 14",
        anchor: ".artwork-information",
        anchorPoint: "top-left",
        offsetX: -4,
        offsetY: -2
    },

    {
        text: "2023 · Acrylic",
        anchor: ".artwork-information",
        anchorPoint: "top-left",
        offsetX: 0,
        offsetY: 5
    },


    {
        text: "←",
        anchor: "#artworkTitle",
        anchorPoint: "top-left",
        offsetX: -3,
        offsetY: 2
    },

    {
        text: "→",
        anchor: "#artworkTitle",
        anchorPoint: "top-right",
        offsetX: 3,
        offsetY: 1
    }

];


/* =========================================================
   GRID SCALE
========================================================= */

function setGridScale() {

    const width = window.innerWidth;

    if (width <= 600) {

        spacingX = 12;
        spacingY = 11;
        characterSize = 7;

    } else if (width <= 1000) {

        spacingX = 20;
        spacingY = 13;
        characterSize = 9;

    } else {

        spacingX = 24;
        spacingY = 15;
        characterSize = 11;

    }

}


/* =========================================================
   CANVAS SETUP
========================================================= */

function setupCanvases() {

    pageWidth = document.documentElement.scrollWidth;
    pageHeight = document.documentElement.scrollHeight;

    dpr = window.devicePixelRatio || 1;

    baseCanvas.width = pageWidth * dpr;
    baseCanvas.height = pageHeight * dpr;

    hoverCanvas.width = pageWidth * dpr;
    hoverCanvas.height = pageHeight * dpr;

    baseCanvas.style.width = pageWidth + "px";
    baseCanvas.style.height = pageHeight + "px";

    hoverCanvas.style.width = pageWidth + "px";
    hoverCanvas.style.height = pageHeight + "px";

    baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hoverCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

}


/* =========================================================
   GENERATE CHARACTER GRID
========================================================= */

function generateCharacterMap() {

    characterMap = [];

    const rows =
        Math.floor(pageHeight / spacingY);

    const columns =
        Math.floor(pageWidth / spacingX);

    const gridWidth =
        columns * spacingX;

    const offsetX =
        (pageWidth - gridWidth) / 2 + 10;


    for (let row = 0; row < rows; row++) {

        for (let column = 0; column < columns; column++) {

            const x =
                offsetX + column * spacingX;

            const y =
                row * spacingY;

            const character =
                characters[
                    Math.floor(
                        Math.random() * characters.length
                    )
                ];

            characterMap.push({
                x: x,
                y: y,
                character: character
            });

        }

    }

}
/* =========================================================
   PLACE EMBEDDED TEXT
========================================================= */

function placeEmbeddedText() {

    const rows =
        Math.floor(pageHeight / spacingY);

    const columns =
        Math.floor(pageWidth / spacingX);

    embeddedText.forEach((item) => {

        const anchor =
            document.querySelector(item.anchor);

        if (!anchor) {
            return;
        }

        const rect =
            anchor.getBoundingClientRect();

        let anchorX;
        let anchorY;


        /* -------------------------------------------------
           ANCHOR POINT
        ------------------------------------------------- */

        if (item.anchorPoint === "bottom-left") {

            anchorX = rect.left;

            anchorY =
                rect.bottom +
                window.scrollY;

        }

        else if (item.anchorPoint === "bottom-right") {

            anchorX = rect.right;

            anchorY =
                rect.bottom +
                window.scrollY;

        }

        else if (item.anchorPoint === "top-left") {

            anchorX = rect.left;

            anchorY =
                rect.top +
                window.scrollY;

        }

        else if (item.anchorPoint === "top-center") {

            anchorX =
                rect.left +
                rect.width / 2;

            anchorY =
                rect.top +
                window.scrollY;

        }
        else if (item.anchorPoint === "top-right") {

            anchorX =
                rect.right;

            anchorY =
                rect.top +
                window.scrollY;

        }


        /* -------------------------------------------------
           ROW
        ------------------------------------------------- */

        let row;

        if (
            item.anchorPoint === "top-left" ||
            item.anchorPoint === "top-center"
        ) {

            row =
                Math.floor(
                    anchorY / spacingY
                )
                + item.offsetY;

        }

        else {

            row =
                Math.floor(
                    (anchorY + 20) / spacingY
                )
                + item.offsetY;

        }


        /* -------------------------------------------------
           TEXT
        ------------------------------------------------- */

        const lines =
            Array.isArray(item.text)
                ? item.text
                : [item.text];


        lines.forEach((line, lineIndex) => {

            let column;


            if (item.anchorPoint === "top-center") {

                column =
                    Math.floor(anchorX / spacingX)
                    - Math.floor(line.length / 2)
                    + item.offsetX;

            }

            else if (item.anchorPoint === "top-right") {

                column =
                    Math.floor(anchorX / spacingX)
                    - line.length
                    + item.offsetX;

            }

            else {

                column =
                    Math.floor(anchorX / spacingX)
                    + item.offsetX;

            }


            for (
                let letterIndex = 0;
                letterIndex < line.length;
                letterIndex++
            ) {

                let textColumn;


                if (
                    item.anchorPoint === "bottom-right"
                ) {

                    textColumn =
                        column -
                        line.length +
                        1;

                }

                else {

                    textColumn =
                        column;

                }


                const index =
                    (row + lineIndex) * columns +
                    textColumn +
                    letterIndex;


                if (characterMap[index]) {

                    characterMap[index].character =
                        line[letterIndex];

                    characterMap[index].embedded =
                        true;

                }

            }

        });

    });

}

/* =========================================================
   UPDATE ARTWORK COUNTER
========================================================= */

function updateArtworkCounter() {

    embeddedText[1].text =
        `${String(currentIndex + 1).padStart(2, "0")} / ${String(artworks.length).padStart(2, "0")}`;

}

function updateArtworkMeta() {

    embeddedText[2].text =
        artworks[currentIndex].meta;

}

/* =========================================================
   DRAW BASE CHARACTERS
========================================================= */

function drawBaseCharacters() {

    baseCtx.clearRect(
        0,
        0,
        pageWidth,
        pageHeight
    );

    baseCtx.font =
        `${characterSize}px "Courier New", monospace`;

    baseCtx.textAlign = "center";

    characterMap.forEach((item) => {

        if (item.embedded) {

            baseCtx.fillStyle =
                "#eee9d9";

        } else {

            baseCtx.fillStyle =
                "rgb(26, 26, 26)";

        }

        baseCtx.fillText(
            item.character,
            item.x,
            item.y
        );

    });

}


/* =========================================================
   HOVER CHARACTERS
========================================================= */

function drawHoverCharacters() {

    hoverCtx.clearRect(
        0,
        0,
        pageWidth,
        pageHeight
    );

    if (
        mouseX < 0 ||
        mouseY < 0
    ) {
        return;
    }

    hoverCtx.font =
        `${characterSize}px "Courier New", monospace`;

    hoverCtx.textAlign = "center";

    const hoverRadius = 150;

    characterMap.forEach((item) => {

        if (item.embedded) {
            return;
        }

        const distance = Math.sqrt(
            Math.pow(item.x - mouseX, 2) +
            Math.pow(item.y - mouseY, 2)
        );

        if (distance > hoverRadius) {
            return;
        }

        const intensity =
            1 - distance / hoverRadius;

        const brightness =
            26 +
            intensity *
            (106 - 26);

        hoverCtx.fillStyle = `
            rgb(
                ${brightness},
                ${brightness},
                ${brightness}
            )
        `;

        hoverCtx.fillText(
            item.character,
            item.x,
            item.y
        );

    });

}

/* =========================================================
   MOUSE
========================================================= */

window.addEventListener("mousemove", (event) => {

    mouseX = event.pageX;
    mouseY = event.pageY;

    drawHoverCharacters();

});


/* =========================================================
   INITIALIZE
========================================================= */

setGridScale();

setupCanvases();

generateCharacterMap();

placeEmbeddedText();

drawBaseCharacters();

/* =========================================================
   RESIZE
========================================================= */

window.addEventListener("resize", () => {

    setGridScale();

    setupCanvases();

    generateCharacterMap();

    placeEmbeddedText();

    drawBaseCharacters();

    drawHoverCharacters();

    positionNavigationLinks();

});

/* =========================================================
   HUMAN FORM COLLECTION
========================================================= */

const artworks = window.collectionConfig?.artworks || [

    {
        image: "../images/Webp/Human Form/H1.webp",
        title: "Artwork 01",
        meta: "2022 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H2.webp",
        title: "Artwork 02",
        meta: "2022 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H3.webp",
        title: "Artwork 03",
        meta: "2022 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H4.webp",
        title: "Artwork 04",
        meta: "2022 · MONOSCREEN PRINT",
    },

    {
        image: "../images/Webp/Human Form/H5.webp",
        title: "Artwork 05",
        meta: "2022 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H6.webp",
        title: "Artwork 06",
        meta: "2023 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H7.webp",
        title: "Artwork 07",
        meta: "2023 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H8.webp",
        title: "Artwork 08",
        meta: "2023 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H9.webp",
        title: "Artwork 09",
        meta: "2023 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H10.webp",
        title: "Artwork 10",
        meta: "2023 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H11.webp",
        title: "Artwork 11",
        meta: "2022 · ACRYLIC",
    },

    {
        image: "../images/Webp/Human Form/H12.webp",
        title: "Artwork 12",
        meta: "2022 · MONOSCREEN PRINT",
    },

    {
        image: "../images/Webp/Human Form/H13.webp",
        title: "Artwork 13",
        meta: "2022 · MONOSCREEN PRINT",
    },

    {
        image: "../images/Webp/Human Form/H14.webp",
        title: "Artwork 14",
        meta: "2023 · MONOTYPE PRINT",
    }

];

function getOriginalImagePath(index) {
    const artwork = artworks[index];

    if (artwork.originalImage) {
        return artwork.originalImage;
    }

    const number = index + 1;
    let extension = "jpeg";

    if (number === 8 || number === 10) {
        extension = "jpg";
    } else if (number === 9) {
        extension = "png";
    }

    return `../images/H${number}.${extension}`;
}

const preloadedImages = artworks.map((artwork) => {

    const image = new Image();

    image.src = artwork.image;

    return image;

});

let currentIndex = 0;


/* =========================================================
   ELEMENTS
========================================================= */

const mainImage =
    document.querySelector("#mainImage");

const previousArtwork =
    document.querySelector("#previousArtwork");

const nextArtwork =
    document.querySelector("#nextArtwork");

const artworkTitle =
    document.querySelector("#artworkTitle");

const mainArtwork =
    document.querySelector("#mainArtwork");

let previousLink;
let nextLink;

function createNavigationLinks() {

    if (previousLink) {
        previousLink.remove();
    }

    if (nextLink) {
        nextLink.remove();
    }


    previousLink =
        document.createElement("button");

    previousLink.type = "button";

    previousLink.setAttribute(
        "aria-label",
        "Previous artwork"
    );


    nextLink =
        document.createElement("button");

    nextLink.type = "button";

    nextLink.setAttribute(
        "aria-label",
        "Next artwork"
    );


    document.body.appendChild(
        previousLink
    );

    document.body.appendChild(
        nextLink
    );


    previousLink.addEventListener(
        "click",
        goPrevious
    );

    nextLink.addEventListener(
        "click",
        goNext
    );

    previousLink.addEventListener(
        "mouseenter",
        () => {
            cursor.classList.add("active");
        }
    );

    previousLink.addEventListener(
        "mouseleave",
        () => {
            cursor.classList.remove("active");
        }
    );

    nextLink.addEventListener(
        "mouseenter",
        () => {
            cursor.classList.add("active");
        }
    );

    nextLink.addEventListener(
        "mouseleave",
        () => {
            cursor.classList.remove("active");
        }
    );


    positionNavigationLinks();

}

function positionNavigationLinks() {

    if (!previousLink || !nextLink) {
        return;
    }

    const anchor =
        document.querySelector("#artworkTitle");

    if (!anchor) {
        return;
    }

    const rect =
        anchor.getBoundingClientRect();


    /* -------------------------------------------------
       PREVIOUS ARROW
    ------------------------------------------------- */

    const previousColumn =
        Math.floor(rect.left / spacingX) - 3;


    previousLink.style.position =
        "absolute";

    previousLink.style.left =
        (
            previousColumn *
            spacingX
        ) + "px";

    previousLink.style.top =
        (
            Math.floor(
                (rect.top + window.scrollY) /
                spacingY
            ) * spacingY
            - characterSize
            + spacingY * 2
        ) + "px";

    previousLink.style.width = 
        spacingX * 6 + "px";
        
    previousLink.style.height = 
        spacingY * 3 + "px";


    /* -------------------------------------------------
       NEXT ARROW
    ------------------------------------------------- */

    const nextColumn =
        Math.floor(rect.right / spacingX) + 2;


    nextLink.style.position =
        "absolute";

    nextLink.style.left =
        (
            nextColumn *
            spacingX
        ) + "px";

    nextLink.style.top =
        (
            Math.floor(
                (rect.top + window.scrollY) /
                spacingY
            ) * spacingY
            - characterSize
            + spacingY * 2
        ) + "px";

    nextLink.style.width =
        spacingX * 6 + "px";

    nextLink.style.height =
        spacingY * 3 + "px";


    /* -------------------------------------------------
       STYLE
    ------------------------------------------------- */

    previousLink.style.zIndex = "20";
    nextLink.style.zIndex = "20";

    previousLink.style.background =
        "transparent";

    nextLink.style.background =
        "transparent";

    previousLink.style.border =
        "none";

    nextLink.style.border =
        "none";

    previousLink.style.padding =
        "0";

    nextLink.style.padding =
        "0";

    previousLink.style.cursor =
        "none";

    nextLink.style.cursor =
        "none";

}

/* =========================================================
   GET INDEX
========================================================= */

function getIndex(offset) {

    return (
        currentIndex +
        offset +
        artworks.length
    ) % artworks.length;

}


/* =========================================================
   UPDATE GALLERY
========================================================= */

function updateGallery(direction = 0) {

    updateArtworkCounter();

    updateArtworkMeta();

    generateCharacterMap();

    placeEmbeddedText();

    drawBaseCharacters();

    const previousIndex = getIndex(-1);
    const nextIndex = getIndex(1);

    const current = artworks[currentIndex];
    const previous = artworks[previousIndex];
    const next = artworks[nextIndex];


    /* -------------------------------------------------
       MOVEMENT DIRECTION
    ------------------------------------------------- */

    const movement =
        direction > 0 ? -40 : 40;


    /* -------------------------------------------------
       FADE / SLIDE OUT
    ------------------------------------------------- */

    mainArtwork.style.transition =
        "opacity 350ms ease, transform 450ms cubic-bezier(.22,.61,.36,1)";

    mainArtwork.style.opacity =
        "0";

    mainArtwork.style.transform =
        `translateX(${movement}px)`;


    /* -------------------------------------------------
       LOAD NEW ARTWORK
    ------------------------------------------------- */

    setTimeout(() => {

        mainImage.src =
            preloadedImages[currentIndex].src;

        mainImage.alt =
            current.title;

        artworkTitle.textContent =
            current.title;
        
        artworkTitle.classList.toggle(
            "japanese-title",
            current.titleFont === "japanese"
        );


        previousArtwork.querySelector("img").src =
            previous.image;

        previousArtwork.querySelector("img").alt =
            previous.title;


        nextArtwork.querySelector("img").src =
            next.image;

        nextArtwork.querySelector("img").alt =
            next.title;


        /* ---------------------------------------------
           PUT NEW ARTWORK ON OPPOSITE SIDE
        --------------------------------------------- */

        mainArtwork.style.transition =
            "none";

        mainArtwork.style.opacity =
            "0";

        mainArtwork.style.transform =
            `translateX(${-movement}px)`;


        /* ---------------------------------------------
           FORCE POSITION BEFORE ANIMATION
        --------------------------------------------- */

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                mainArtwork.style.transition =
                    "opacity 500ms ease, transform 650ms cubic-bezier(.22,.61,.36,1)";

                mainArtwork.style.opacity =
                    "1";

                mainArtwork.style.transform =
                    "translateX(0)";

            });

        });

    }, 350);

}


/* =========================================================
   NAVIGATION
========================================================= */

function goNext() {

    currentIndex =
        getIndex(1);

    updateGallery(1);

}


function goPrevious() {

    currentIndex =
        getIndex(-1);

    updateGallery(-1);

}


nextArtwork.addEventListener(
    "click",
    goNext
);

previousArtwork.addEventListener(
    "click",
    goPrevious
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "ArrowRight") {
            goNext();
        }

        if (event.key === "ArrowLeft") {
            goPrevious();
        }

    }
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

const cursor =
    document.querySelector(".custom-cursor");


document.addEventListener(
    "mousemove",
    (event) => {

        cursor.style.left =
            `${event.clientX}px`;

        cursor.style.top =
            `${event.clientY}px`;

    }
);


document.querySelectorAll(
    "a, button"
).forEach((element) => {

    element.addEventListener(
        "mouseenter",
        () => {
            cursor.classList.add("active");
        }
    );

    element.addEventListener(
        "mouseleave",
        () => {
            cursor.classList.remove("active");
        }
    );

});


/* =========================================================
   INITIAL LOAD
========================================================= */

const artworkParam = new URLSearchParams(window.location.search).get("artwork");
const requestedArtwork = Number.parseInt(artworkParam, 10);

if (requestedArtwork >= 1 && requestedArtwork <= artworks.length) {
    currentIndex = requestedArtwork - 1;
}

updateGallery();
createNavigationLinks();

/* =========================================================
   FULLSCREEN IMAGE VIEWER
========================================================= */

const imageViewer = document.getElementById("imageViewer");
const viewerImage = document.getElementById("viewerImage");
const viewerClose = document.getElementById("viewerClose");
const viewerPrevious = document.getElementById("viewerPrevious");
const viewerNext = document.getElementById("viewerNext");
const viewerZoomIn = document.getElementById("viewerZoomIn");
const viewerZoomOut = document.getElementById("viewerZoomOut");
const viewerZoomReset = document.getElementById("viewerZoomReset");
const viewerZoomLevel = document.getElementById("viewerZoomLevel");
const viewerCaption = document.getElementById("viewerCaption");

let viewerZoom = 1;

function updateViewerZoom() {
    viewerImage.style.transform = `scale(${viewerZoom})`;
    viewerZoomLevel.textContent = `${Math.round(viewerZoom * 100)}%`;
}

function showViewerArtwork() {
    const artwork = artworks[currentIndex];

    viewerImage.src = getOriginalImagePath(currentIndex);
    viewerImage.alt = artwork.title;

    viewerCaption.textContent = `${artwork.title} — ${artwork.meta}`;

    viewerZoom = 1;
    updateViewerZoom();
}

function openImageViewer() {
    showViewerArtwork();

    imageViewer.classList.add("is-open");
    imageViewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeImageViewer() {
    imageViewer.classList.remove("is-open");
    imageViewer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    viewerZoom = 1;
    updateViewerZoom();
}

function navigateViewer(direction) {
    if (direction > 0) {
        goNext();
    } else {
        goPrevious();
    }

    showViewerArtwork();
}

// Open when the main artwork is clicked.
mainArtwork.style.cursor = "zoom-in";
mainArtwork.addEventListener("click", () => {
    if (Date.now() < suppressArtworkClickUntil) return;

    openImageViewer();
});
// Close the viewer.
viewerClose.addEventListener("click", closeImageViewer);

// Navigate between artworks.
viewerPrevious.addEventListener("click", () => navigateViewer(-1));
viewerNext.addEventListener("click", () => navigateViewer(1));

// Zoom controls.
viewerZoomIn.addEventListener("click", () => {
    viewerZoom = Math.min(viewerZoom + 0.25, 4);
    updateViewerZoom();
});

viewerZoomOut.addEventListener("click", () => {
    viewerZoom = Math.max(viewerZoom - 0.25, 1);
    updateViewerZoom();
});

viewerZoomReset.addEventListener("click", () => {
    viewerZoom = 1;
    updateViewerZoom();
});

// Keyboard controls while the viewer is open.
document.addEventListener("keydown", (event) => {
    if (!imageViewer.classList.contains("is-open")) return;

    if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeImageViewer();
    } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopImmediatePropagation();
        navigateViewer(-1);
    } else if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopImmediatePropagation();
        navigateViewer(1);
    }
}, true);

/* =========================================================
   BORDERLESS MAGNIFICATION LENS
========================================================= */

const magnifierLens = document.getElementById("magnifierLens");
const magnifierLensImage = document.getElementById("magnifierLensImage");

const lensSize = 250;
const lensZoom = 2;

function positionMagnifier(event) {
    const rect = viewerImage.getBoundingClientRect();
    const lensSize = magnifierLens.offsetWidth;

    // Only show the lens over the actual artwork.
    const overArtwork =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

    if (
        !imageViewer.classList.contains("is-open") ||
        !overArtwork
    ) {
        magnifierLens.classList.remove("is-visible");
        document.body.classList.remove("magnifier-active");
        return;
    }

    magnifierLens.style.left = `${event.clientX}px`;
    magnifierLens.style.top = `${event.clientY}px`;

    // Use the same original image as the fullscreen viewer.
    if (magnifierLensImage.src !== viewerImage.src) {
        magnifierLensImage.src = viewerImage.src;
    }

    const scaledWidth = rect.width * lensZoom;
    const scaledHeight = rect.height * lensZoom;

    magnifierLensImage.style.width = `${scaledWidth}px`;
    magnifierLensImage.style.height = `${scaledHeight}px`;

    // Keep the pixels beneath the cursor aligned inside the lens.
    magnifierLensImage.style.left =
        `${(rect.left - event.clientX) * lensZoom + lensSize / 2}px`;

    magnifierLensImage.style.top =
        `${(rect.top - event.clientY) * lensZoom + lensSize / 2}px`;

    magnifierLens.classList.add("is-visible");
    document.body.classList.add("magnifier-active");
}

viewerImage.addEventListener("mousemove", positionMagnifier);

viewerImage.addEventListener("mouseleave", () => {
    magnifierLens.classList.remove("is-visible");
    document.body.classList.remove("magnifier-active");
});

imageViewer.addEventListener("mousemove", (event) => {
    if (event.target !== viewerImage) {
        magnifierLens.classList.remove("is-visible");
        document.body.classList.remove("magnifier-active");
    }
});

viewerImage.addEventListener("load", () => {
    magnifierLensImage.src = viewerImage.src;
});

// Clean up when the viewer closes.
viewerClose.addEventListener("click", () => {
    magnifierLens.classList.remove("is-visible");
    document.body.classList.remove("magnifier-active");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        magnifierLens.classList.remove("is-visible");
        document.body.classList.remove("magnifier-active");
    }
});
/* Make the main artwork trigger the existing hover cursor */
mainArtwork.addEventListener("mouseenter", () => {
    cursor.classList.add("active");
});

mainArtwork.addEventListener("mouseleave", () => {
    cursor.classList.remove("active");
});
/* =========================================================
   TOUCH SWIPE — COLLECTION GALLERY
========================================================= */

const swipeSurface = document.querySelector(".artwork-stage");

let swipeStartX = 0;
let swipeStartY = 0;
let swipeMoved = false;
let suppressArtworkClickUntil = 0;

if (swipeSurface) {
    swipeSurface.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "touch") return;
        if (imageViewer.classList.contains("is-open")) return;

        swipeStartX = event.clientX;
        swipeStartY = event.clientY;
        swipeMoved = false;
    });

    swipeSurface.addEventListener("pointerup", (event) => {
        if (event.pointerType !== "touch") return;
        if (imageViewer.classList.contains("is-open")) return;

        const deltaX = event.clientX - swipeStartX;
        const deltaY = event.clientY - swipeStartY;

        if (
            Math.abs(deltaX) < 45 ||
            Math.abs(deltaX) < Math.abs(deltaY) * 1.2
        ) {
            return;
        }

        swipeMoved = true;
        suppressArtworkClickUntil = Date.now() + 700;

        if (deltaX < 0) {
            goNext();
        } else {
            goPrevious();
        }
    });

    swipeSurface.addEventListener("pointercancel", () => {
        swipeMoved = false;
    });
}

/* TOUCH SWIPE — FULLSCREEN VIEWER */
let viewerTouchStartX = 0;
let viewerTouchStartY = 0;
let viewerPinching = false;

imageViewer.addEventListener("touchstart", (event) => {
    if (!imageViewer.classList.contains("is-open")) return;

    // Detect pinch-to-zoom
    if (event.touches.length > 1) {
        viewerPinching = true;
        return;
    }

    viewerPinching = false;

    const touch = event.changedTouches[0];
    viewerTouchStartX = touch.clientX;
    viewerTouchStartY = touch.clientY;
}, { passive: true });

imageViewer.addEventListener("touchend", (event) => {
    if (!imageViewer.classList.contains("is-open")) return;

    // Ignore pinch gestures and fingers still touching the screen
    if (viewerPinching || event.touches.length > 0) {
        if (event.touches.length === 0) {
            viewerPinching = false;
        }
        return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - viewerTouchStartX;
    const deltaY = touch.clientY - viewerTouchStartY;

    // Don't navigate or close while zoomed in
    if (viewerZoom > 1) return;

    // Swipe down to close fullscreen
    if (deltaY > 100 && Math.abs(deltaY) > Math.abs(deltaX) * 1.3) {
        closeImageViewer();
        return;
    }

    // Swipe left/right to change artwork
    if (Math.abs(deltaX) > 50 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        if (deltaX < 0) {
            navigateViewer(1);
        } else {
            navigateViewer(-1);
        }
    }
}, { passive: true });