let isButtonDisplayed = false;

function swapWithoutConfirmation() {
  console.log("pressed!");
}

const targetButtonId = "confirm-swap-or-send";

function cloneAndAppendSwapButton() {
  const button = document.getElementById(targetButtonId);

  if (!isButtonDisplayed && button && button.firstChild) {
    const firstChild = button.firstChild as HTMLElement;
    // Check if the child's innerText includes "swap"
    if (firstChild.innerText.includes("swap")) {
      const cloneButton = button.cloneNode(true) as HTMLElement;

      cloneButton.style.marginTop = "10px";
      cloneButton.style.backgroundColor = "rgb(229 18 234)";
      if (cloneButton.firstChild) {
        (cloneButton.firstChild as HTMLElement).innerText =
          "Swap without confirmation";
      }

      cloneButton.onclick = swapWithoutConfirmation;

      // Add the cloned button to the parent
      button.parentNode?.appendChild(cloneButton);

      isButtonDisplayed = true;
    }
  }
}

// Create an observer instance linked to a callback function
const observer = new MutationObserver(function (mutationsList, observer) {
  // Check each mutation record
  let modified = false;
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const button = document.getElementById(targetButtonId);

      if (button) {
        cloneAndAppendSwapButton();
        modified = true;
      }
    }
  }
  if (!modified) {
    isButtonDisplayed = false;
  }
});

// Options for the observer (which parts of the DOM to monitor)
const config = { attributes: false, childList: true, subtree: true };

// Start observing the document body for DOM changes
observer.observe(document.body, config);

// Initial check in case the element is already there
cloneAndAppendSwapButton();
