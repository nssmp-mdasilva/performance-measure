// Example array of IDs to target
const targetElementIds = ["top-sportsbooks"];
function checkForGlobalVariable() {
    let myGlobalVar = localStorage.getItem("myPer");

    if (myGlobalVar) {
      console.log("Global variable found:", myGlobalVar);
    //   chrome.runtime.sendMessage(
    //     { action: "getGlobalVar", globalVar: myGlobalVar },
    //     (response) => {
    //       console.log('Received from background script:', response.globalVar);
    //     }
    //   );
      chrome.runtime.sendMessage({ type: "globalVariable", data: myGlobalVar });
    } else {
        console.log('Global variable not found');
    }
  }

// Wait for the page to fully load (including all scripts)
window.addEventListener('load', function () {
    checkForGlobalVariable();
  });

//   window.addEventListener('unload', function() {
//     localStorage.removeItem("myPerfVar");
//   })

// Function to add the frame with page information
function addPageInfoFrame() {
  const frame = document.createElement('div');
  frame.style.position = 'fixed';
  frame.style.top = '0';
  frame.style.left = '0';
  frame.style.width = '100%';
  frame.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  frame.style.color = 'white';
  frame.style.padding = '10px';
  frame.style.zIndex = '10000';
  frame.style.fontSize = '14px';
  frame.style.fontFamily = 'Arial, sans-serif';
  frame.style.display = 'flex';
  frame.style.justifyContent = 'space-between';
  frame.style.alignItems = 'center';

  // Add information from the array to the frame
  const infoText = document.createElement('span');
  infoText.textContent = `Targeted Elements: ${targetElementIds.join(', ')}`;

  // Add the info to the frame
  frame.appendChild(infoText);
  
  // Append frame to body
  document.body.appendChild(frame);
}

// Function to add borders to targeted elements
function addBordersToTargetElements() {
  targetElementIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.border = '2px solid red';
      element.style.padding = '10px';
    }
  });
}

// Run the functions after the page is fully loaded
window.addEventListener('load', () => {
  addPageInfoFrame();
  addBordersToTargetElements();
});
