// Listen for the message from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "globalVariable") {
      console.log("Global variable received in background script:", message.data);
      // You can process the value or store it as needed
    }
    // if (request.action === "getGlobalVar") {
    //     // Send a response with the stored global variable
    //     sendResponse({ globalVar: request.globalVar });
    //   }
  });