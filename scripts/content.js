let elementFramesItems = [];
let initialized = false;
let pageLoadTime = null;

function displayInfo(type, payload) {
    switch (type) {
        case 'measure': displayMeasureInfo(payload);
    }
}

function displayMeasureInfo({ selector, duration }) {
    displayMeasureInElementFrame(selector, duration);
}

function displayMeasureInElementFrame(selector, duration) {
    if (initialized) {
        const infoText = createInfoText(selector, duration);
        console.log('infoText', infoText);
        let elementInfoFrame = getOrCreateElementInfoFrame(selector);
        elementInfoFrame.appendChild(infoText);

    } else {
        elementFramesItems.push({ selector, duration });
    }
}

function getOrCreateElementInfoFrame(selector) {
    console.log('getOrCreateElementInfoFrame');
    console.log(selector);
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

function createInfoText(selector, duration) {
    const percentageOfLoadTime = ((duration / pageLoadTime) * 100).toFixed(4);

    const infoWrapper = document.createElement('div');
          infoWrapper.classList.add('info-wrapper');

    const infoText = document.createElement('span');
          infoText.classList.add('info-selector');
          infoText.textContent = `${selector.replace('#', '').replace('-', ' ')}`;

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

function initializeElementInfoFrames() {
    while (elementFramesItems.length) {

        const { selector, duration } = elementFramesItems.pop();

        console.log('show the selector')
        console.log(selector)
        const infoText = createInfoText(selector, duration);

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
}

function observePerformance() {
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
            if (entry.entryType === 'measure') {
                const selector = entry?.detail?.selector;
                const duration = entry.duration || entry.value;

                if (selector && duration) {
                    displayInfo(entry.entryType, { selector, duration });
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
    observePerformance();

    window.addEventListener('load', () => {
        setTimeout(() => {
            getPageLoadTime();
            initializeElementInfoFrames();
            initialized = true;
        }, 0);
    });
}

initialize();



document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const button = document.getElementById('accessPerformanceDataButton');
        if (button) {
            button.addEventListener('click', () => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) {
                      chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: renderPerformanceData,
                        args: [{ className: `.element-info-frame, .info-wrapper, .element-highlight` }]
                      });
                    }
                  });
              });
        }
    }, 100);
});


  
function renderPerformanceData({className}) {
    const elements = document.querySelectorAll(className);

    elements.forEach(element => {
        element.classList.add('show');
    });
// document.body.style.backgroundColor = 'lightgreen';
}


