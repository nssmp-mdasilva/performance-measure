let elementFramesItems = [];
let initialized = false;

function displayInfo(type, payload) {
    switch (type) {
        case 'measure': displayMeasureInfo(payload);
    }
}

function displayMeasureInfo({ selector, duration }) {
    displayMeasureInElementFrame(selector, duration);
}

function displayMeasureInElementFrame(selector, duration) {
    const infoText = createInfoText(selector, duration);

    if (initialized) {
        let elementInfoFrame = getOrCreateElementInfoFrame(selector);
        elementInfoFrame.appendChild(infoText);
    } else {
        elementFramesItems.push({ selector, infoText });
    }
}

function createInfoText(selector, duration) {
    const infoText = document.createElement('span');
    infoText.textContent = `Selector: ${selector} | Duration: ${duration.toFixed(2)}ms`;
    infoText.appendChild(document.createElement('br'));
    return infoText;
}

function getOrCreateElementInfoFrame(selector) {
    const element = document.querySelector(selector);
    let frame = element.getElementsByClassName('element-info-frame')[0] || null;

    if (!frame) {
        frame = createElementInfoFrame(element);
    }

    highlightElement(selector);

    return frame;
}

function createElementInfoFrame(element) {
    let elementInfoFrame = document.createElement('div');
    elementInfoFrame.classList.add('element-info-frame');
    elementInfoFrame.style.position = 'absolute';
    elementInfoFrame.style.top = '0';
    elementInfoFrame.style.left = '0';
    elementInfoFrame.style.width = '100%';
    elementInfoFrame.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    elementInfoFrame.style.color = 'white';
    elementInfoFrame.style.padding = '10px';
    elementInfoFrame.style.zIndex = '10000';
    elementInfoFrame.style.fontSize = '14px';
    elementInfoFrame.style.fontFamily = 'Arial, sans-serif';
    elementInfoFrame.style.display = 'flex';
    elementInfoFrame.style.flexDirection = 'column';

    // element.style.position = 'relative';
    element.appendChild(elementInfoFrame);

    return elementInfoFrame;
}

// Function to add borders to targeted elements
function highlightElement(selector) {
    const element = document.querySelector(selector);

    if (element) {
        element.style.border = '2px solid red';
    }
}

// Add any element info frames that wasn't added before initialization
function initializeElementInfoFrames() {
    while (elementFramesItems.length) {
        const { selector, infoText } = elementFramesItems.pop();

        let elementInfoFrame = getOrCreateElementInfoFrame(selector);
        elementInfoFrame.appendChild(infoText);
    }
}

// Observe performance events and display them in UI
function observePerformance() {
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
            const selector = entry?.detail?.selector;
            const duration = entry.duration || entry.value;

            if (selector && duration) {
                displayInfo(entry.entryType, { selector, duration });
            }
        });
    });

    observer.observe({ entryTypes: ['measure'] });
}

// Initialize performance observation
function initialize() {
    observePerformance();

    window.addEventListener('load', () => {
        initializeElementInfoFrames();
        initialized = true;
    });
}

initialize();