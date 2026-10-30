window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});

const baseCanvas = document.querySelector('#character-base');
const hoverCanvas = document.querySelector('#character-hover');

const baseCtx = baseCanvas.getContext('2d');
const hoverCtx = hoverCanvas.getContext('2d');

const characters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'O', 'U', 'X', '+', '*', '/', '0',
    '1', '2', '3', '#', '%', '&'
];

const easterEggs = [
    " HUMAN FORM ",
    " UGO BODARD ",
    " WE'RE ALL HUMAN ",
    " LOVE IS ETERNAL ",
    " WE KILLED ART ",
    " BRING BACK AUTHENTICITY ",
    " FUCK AI ",
    " WE ARE THE ARTISTS ",
];

const embeddedText = [
    {
        text: [
            "SELECTED",
            "WORKS"
        ],
        anchor: ".hero-title",
        anchorPoint: "bottom-left",
        offsetX: 1,
        offsetY: -2
    },
    {
        text: [
            "CROUCHED MAN · 2023",
            "ACRYLIC",
        ],
        anchor: ".featured",
        anchorPoint: "bottom-right",
        offsetX: -1,
        offsetY: 1
    },
    {
        text: "COLLECTIONS",
        anchor: ".collection-card",
        anchorPoint: "top-left",
        offsetX: 0,
        offsetY: -1
    },
    {
        text: "ABOUT",
        anchor: ".about",
        anchorPoint: "top-center",
        offsetX: 0,
        offsetY: -5
    },
    {
        text: [
            "UGO GUY DANIEL GIL BODARD",
            "",
            "FINE ARTIST",
            "",
            "BASED IN TOKYO, JAPAN",
            "",
            "",
            "",
            "",
            "CONTACT",
            "",
            "",
            "",
            "",
            "EMAIL",
            "",
            "INSTAGRAM",
            
        ],
        anchor: ".about",
        anchorPoint: "top-center",
        offsetX: 0,
        offsetY: 0
    },
    {
        text: "ALL WORKS © 2026",
        anchor: "footer",
        anchorPoint: "top-center",
        offsetX: 0,
        offsetY: 1
    },
    {
        text: "BACK TO TOP ↑",
        anchor: "footer",
        anchorPoint: "top-center",
        offsetX: 0,
        offsetY: 3
    }
];

let spacingX;
let spacingY;
let characterSize;

function setGridScale() {

    const width = window.innerWidth;

    if (width <= 600) {

        // Phone
        spacingX = 12;
        spacingY = 11;
        characterSize = 7;

    } else if (width <= 1000) {

        // Tablet
        spacingX = 20;
        spacingY = 13;
        characterSize = 9;

    } else {

        // Desktop
        spacingX = 24;
        spacingY = 15;
        characterSize = 11;

    }

}

const baseBrightness = 26;
const hoverBrightness = 106;
const hoverRadius = 150;

let pageWidth;
let pageHeight;
let dpr;

let mouseX = -1000;
let mouseY = -1000;

let characterMap = [];


function setupCanvases() {

    pageWidth = document.documentElement.scrollWidth;
    pageHeight = document.documentElement.scrollHeight;

    dpr = window.devicePixelRatio || 1;

    baseCanvas.width = pageWidth * dpr;
    baseCanvas.height = pageHeight * dpr;

    hoverCanvas.width = pageWidth * dpr;
    hoverCanvas.height = pageHeight * dpr;

    baseCanvas.style.width = pageWidth + 'px';
    baseCanvas.style.height = pageHeight + 'px';

    hoverCanvas.style.width = pageWidth + 'px';
    hoverCanvas.style.height = pageHeight + 'px';

    baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    hoverCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

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
                        Math.random() *
                        characters.length
                    )
                ];

            characterMap.push({

                x: x,
                y: y,
                character: character

            });

        }

    }

    const numberOfEasterEggs = 30;

    let placedEggs = 0;

    while (
        placedEggs < numberOfEasterEggs
    ) {

        const word =
            easterEggs[
                Math.floor(
                    Math.random() *
                    easterEggs.length
                )
            ];


        const randomRow =
            Math.floor(
                Math.random() * rows
            );

        const randomColumn =
            Math.floor(
                Math.random() *
                columns
            );


        /* Make sure the word fits */

        if (
            randomColumn +
            word.length >= columns
        ) {

            continue;

        }


        /* Replace existing characters */

        for (
            let letterIndex = 0;
            letterIndex < word.length;
            letterIndex++
        ) {

            const index =
                randomRow * columns +
                randomColumn +
                letterIndex;


            characterMap[index].character =
                word[letterIndex];

        }


        placedEggs++;

    }
}

function placeEmbeddedText() {

    const rows =
        Math.floor(pageHeight / spacingY);

    const columns =
        Math.floor(pageWidth / spacingX);

    embeddedText.forEach((item) => {

        const anchor =
            document.querySelector(item.anchor);

        const rect =
            anchor.getBoundingClientRect();

        let anchorX;
        let anchorY;

        if (item.anchorPoint === "bottom-left") {

            anchorX = rect.left;
            anchorY = rect.bottom + window.scrollY;

        }
        else if (item.anchorPoint === "bottom-right") {

            anchorX = rect.right;
            anchorY = rect.bottom + window.scrollY;
            
        }
        else if (item.anchorPoint === "top-left") {

            anchorX = rect.left;
            anchorY = rect.top + window.scrollY;

        }
        else if (item.anchorPoint === "top-center") {

            anchorX =
                rect.left +
                rect.width / 2;

            anchorY =
                rect.top +
                window.scrollY;

        }



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

        } else {

            row =
                Math.floor(
                    (anchorY + 20) / spacingY
                )
                + item.offsetY;

        }

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

            } else {

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

                if (item.anchorPoint === "bottom-right") {

                    textColumn =
                        column - line.length + 1;

                } else {

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

                    characterMap[index].embedded = true;

                }

            }

        });

    });

}

function createEmailLink() {

    // Remove previous link if it exists
    document.querySelector(".grid-email-link")?.remove();

    const email = "ugobodard@me.com";
    const about = document.querySelector(".about");
    const rect = about.getBoundingClientRect();
    const label = "EMAIL";

    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top + window.scrollY;

    // Match the ABOUT text positioning
    const row = Math.floor(anchorY / spacingY);

    // Email is the 12th line (index 11)
    const emailRow = row + 14;

    const column =
        Math.floor(anchorX / spacingX)
        - Math.floor(label.length / 2);

    // Match the grid's horizontal offset
    const gridWidth =
        Math.floor(pageWidth / spacingX) * spacingX;

    const offsetX =
        (pageWidth - gridWidth) / 2 + 10;

    const link = document.createElement("a");

    link.className = "grid-email-link";
    link.href = `mailto:${email}`;
    link.setAttribute("aria-label", `Email ${email}`);

    link.style.left =
        `${offsetX + column * spacingX - spacingX / 2}px`;

    link.style.top =
        `${emailRow * spacingY - characterSize}px`;

    link.style.width =
        `${label.length * spacingX}px`;

    link.style.height = `${spacingY}px`;

    link.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });

    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });


    document.body.appendChild(link);
}

function createInstagramLink() {
    document.querySelector(".grid-instagram-link")?.remove();

    const about = document.querySelector(".about");
    const rect = about.getBoundingClientRect();
    const label = "INSTAGRAM";

    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top + window.scrollY;
    const row = Math.floor(anchorY / spacingY);

    // INSTAGRAM is two rows below EMAIL
    const instagramRow = row + 16;

    const column =
        Math.floor(anchorX / spacingX)
        - Math.floor(label.length / 2);

    const gridWidth =
        Math.floor(pageWidth / spacingX) * spacingX;

    const offsetX =
        (pageWidth - gridWidth) / 2 + 10;

    const link = document.createElement("a");

    link.className = "grid-instagram-link";
    link.href = "https://www.instagram.com/kin.daimo/";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "Instagram @kin.daimo");

    link.style.position = "absolute";
    link.style.left =
        `${offsetX + column * spacingX - spacingX / 2}px`;
    link.style.top =
        `${instagramRow * spacingY - characterSize}px`;
    link.style.width = `${label.length * spacingX}px`;
    link.style.height = `${spacingY}px`;
    link.style.zIndex = "10";

    link.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });

    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });

    document.body.appendChild(link);
}

function createBackToTopLink() {

    document.querySelector(".grid-back-to-top")?.remove();

    const footer = document.querySelector("footer");
    const rect = footer.getBoundingClientRect();

    const text = "BACK TO TOP ↑";

    // Match the footer's grid position
    const anchorX = rect.left + rect.width / 2;
    const footerY = rect.top + window.scrollY;

    const row =
        Math.floor(footerY / spacingY) + 3;

    const column =
        Math.floor(anchorX / spacingX)
        - Math.floor(text.length / 2);

    // Match the character grid's horizontal offset
    const gridWidth =
        Math.floor(pageWidth / spacingX) * spacingX;

    const offsetX =
        (pageWidth - gridWidth) / 2 + 10;

    // Create the invisible link
    const link = document.createElement("a");

    link.className = "grid-back-to-top";
    link.href = "#";
    link.setAttribute("aria-label", "Back to top");

    // Precisely position it over the text
    link.style.left =
        `${offsetX + column * spacingX - spacingX / 2}px`;

    link.style.top =
        `${row * spacingY - 4}px`;

    link.style.width =
        `${text.length * spacingX}px`;

    link.style.height =
        `${spacingY * 2}px`;

    // Smooth scroll to top
    link.addEventListener("click", (event) => {

        event.preventDefault();

        const startPosition = window.scrollY;
        const duration = 1800;
        const startTime = performance.now();

        document.documentElement.style.scrollBehavior = "auto";

        function scrollAnimation(currentTime) {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const ease =
                0.5 - 0.5 * Math.cos(Math.PI * progress);

            window.scrollTo(
                0,
                startPosition * (1 - ease)
            );

            if (progress < 1) {
                requestAnimationFrame(scrollAnimation);
            } else {
                document.documentElement.style.scrollBehavior = "";
            }

        }

        requestAnimationFrame(scrollAnimation);

    });

    link.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });

    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });

    document.body.appendChild(link);
}

function drawBaseCharacters() {

    baseCtx.clearRect(
        0,
        0,
        pageWidth,
        pageHeight
    );

    baseCtx.font =
        `${characterSize}px "Courier New", monospace`;

    baseCtx.textAlign = 'center';

    baseCtx.fillStyle = `
        rgb(
            ${baseBrightness},
            ${baseBrightness},
            ${baseBrightness}
        )
    `;

    characterMap.forEach((item) => {

        if (item.embedded) {

            baseCtx.fillStyle = '#eee9d9';

        } else {

            baseCtx.fillStyle = `
                rgb(
                    ${baseBrightness},
                    ${baseBrightness},
                    ${baseBrightness}
                )
            `;

        }

        baseCtx.fillText(
            item.character,
            item.x,
            item.y
        );

    });
}

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

    hoverCtx.textAlign = 'center';

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
            baseBrightness +
            intensity *
            (hoverBrightness - baseBrightness);

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

setGridScale();

setupCanvases();

generateCharacterMap();

placeEmbeddedText();

createEmailLink();

createInstagramLink();

createBackToTopLink();

drawBaseCharacters();


window.addEventListener(
    'mousemove',
    (event) => {

        mouseX = event.pageX;
        mouseY = event.pageY;

        drawHoverCharacters();

    }
);

window.addEventListener(
    'resize',
    () => {

        setGridScale();

        setupCanvases();

        generateCharacterMap();

        placeEmbeddedText();

        createEmailLink();

        createInstagramLink();

        createBackToTopLink();

        drawBaseCharacters();

        drawHoverCharacters();

    }
);

const cursor = document.querySelector('.custom-cursor');

function updateCustomCursor(event) {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
}

window.addEventListener('mousemove', updateCustomCursor);

const clickableElements = document.querySelectorAll(
    'a, button, input, textarea, select, #mainArtwork'
);

clickableElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Hide the custom cursor while pinch-zoomed in Safari
if (window.visualViewport) {
    const checkZoom = () => {
        const zoomed = window.visualViewport.scale > 1.01;

        cursor.style.display = zoomed ? 'none' : '';

        document.documentElement.style.cursor =
            zoomed ? 'auto' : '';
    };

    window.visualViewport.addEventListener('resize', checkZoom);
    window.visualViewport.addEventListener('scroll', checkZoom);
}