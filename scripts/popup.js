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
}