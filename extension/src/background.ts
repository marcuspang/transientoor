let active = false;

function makeOrange(color: string): void {
  document.body.style.backgroundColor = color;
}

chrome.action..addListener((tab) => {
  console.log("loadedd");
  active = !active;
  const color = active ? "orange" : "white";
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id ? tab.id : -1 },
      func: makeOrange,
      args: [color],
    })
    .then();
});
