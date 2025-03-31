let elementFramesItems = [];
let initialized = false;
let pageLoadTime = null;

function displayInfo(type, payload) {
    switch (type) {
        case 'measure': displayMeasureInfo(payload);
    }
}

function displayMeasureInfo(payload) {
    displayMeasureInElementFrame(payload);
}

function displayMeasureInElementFrame({ selector, duration, name }) {
    if (initialized) {
        const infoText = createInfoText({ selector, duration, name });
        let elementInfoFrame = getOrCreateElementInfoFrame(selector);
        elementInfoFrame.appendChild(infoText);

    } else {
        elementFramesItems.push({ selector, duration, name });
    }
}

function getOrCreateElementInfoFrame(selector) {
    const element = document.querySelector(selector);
    let frame = element.getElementsByClassName('element-info-frame')[0] || null;

    if (!frame) {
        frame = document.createElement('div');
        frame.classList.add('element-info-frame');
    
        // element.style.position = 'relative';
        element.appendChild(frame);
    }

    highlightElement(selector);

    return frame;
}

// Function to add borders to targeted elements
function highlightElement(selector) {
    const element = document.querySelector(selector);

    if (element) {
        element.classList.add('element-highlight');
    }
}

function createInfoText({ selector, duration, name }) {
    const percentageOfLoadTime = ((duration / pageLoadTime) * 100).toFixed(4);

    const infoWrapper = document.createElement('div');
          infoWrapper.classList.add('info-wrapper');

    const infoText = document.createElement('span');
          infoText.classList.add('info-selector');
          infoText.textContent = name || `${selector.replace('#', '').replace('-', ' ')}`;

    const textTop = document.createElement('div');
          textTop.classList.add('info-block_top');
          textTop.innerHTML = `${selector} <span>${percentageOfLoadTime}%</span>`;

    const textBottom = document.createElement('div');
          textBottom.classList.add('info-block_bottom');
          textBottom.textContent = `${duration.toFixed(2)}ms / ${pageLoadTime.toFixed(2)}ms`;
    const infoBlock = document.createElement('div');
          infoBlock.classList.add('info-block');
    
          infoBlock.appendChild(textTop);
          infoBlock.appendChild(textBottom);
    infoWrapper.appendChild(infoText);
    infoWrapper.appendChild(infoBlock);
    return infoWrapper;
}

function renderInfoFrames() {
    while (elementFramesItems.length) {

        const { selector, duration, name } = elementFramesItems.pop();

        const infoText = createInfoText({ selector, duration, name });

        let elementInfoFrame = getOrCreateElementInfoFrame(selector);

        let infoContainer = elementInfoFrame.querySelector('.info-container');
        if (!infoContainer) {
            infoContainer = document.createElement('div');
            infoContainer.classList.add('info-container');
            infoContainer.style.display = 'flex';
            infoContainer.style.flexDirection = 'column';
            infoContainer.style.gap = '5px'; // Add spacing between entries
            elementInfoFrame.appendChild(infoContainer);
        }
        // Append the new info text to the container
        infoContainer.appendChild(infoText);
        elementInfoFrame.appendChild(infoText);
    }

    initialized = true;
}

function observePerformance() {
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        entries.forEach((entry) => {
            if (entry.entryType === 'measure') {
                const selector = entry?.detail?.selector;
                const name = entry?.detail?.name;
                const duration = entry.duration || entry.value;

                if (selector && duration) {
                    displayInfo(entry.entryType, { selector, duration, name });
                }
            }
        });
    });

    observer.observe({ entryTypes: ['measure'] });
}

function getPageLoadTime() {
    const [navigationEntry] = performance.getEntriesByType('navigation');
    pageLoadTime = navigationEntry.duration;
}

// Initialize performance observation
function initialize() {
    // Initialize PerformanceObserver as early as possible
    observePerformance();

    // Render the collected performance data after the window.load event fires
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Page timings are not immediately available on the window.load event
            getPageLoadTime();

            // Attach info frames to DOM elements
            renderInfoFrames();
        }, 0);
    });
}

initialize();