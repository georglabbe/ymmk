chrome.action.onClicked.addListener(function (tab) {
    chrome.storage.local.set({ key: tab.id }).then(() => {
        console.log("now controlling tab with id", tab.id);
    });
});


chrome.commands.onCommand.addListener((command) => {
    console.log("media key pressed");
    chrome.storage.local.get(["key"]).then((result) => {
        console.log("trying to control tab", result.key);
        switch (command) {
            case "play-pause-media":
                console.log("PlayPause media key pressed.");
                chrome.scripting.executeScript({
                    target: { tabId: result.key },
                    function: simulateSpaceKeyPress
                });
                break;
            case "next-media":
                console.log("Next Track media key pressed.");
                chrome.scripting.executeScript({
                    target: { tabId: result.key },
                    function: simulateRightArrowKeyPress
                });
                break;
            case "previous-media":
                console.log("Previous Track media key pressed.");
                chrome.scripting.executeScript({
                    target: { tabId: result.key },
                    function: simulateLeftArrowKeyPress
                });
                break;
        }
    });
});



function simulateSpaceKeyPress() {
    var spaceKeyEvent = new KeyboardEvent("keydown", { key: "SPACE" });
    document.dispatchEvent(spaceKeyEvent);
}

function simulateRightArrowKeyPress() {
    var rightArrowKeyEvent = new KeyboardEvent("keydown", { key: "J" });
    document.dispatchEvent(rightArrowKeyEvent);
}

function simulateLeftArrowKeyPress() {
    var leftArrowKeyEvent = new KeyboardEvent("keydown", { key: "K" });
    document.dispatchEvent(leftArrowKeyEvent);
}