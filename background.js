// set the current youtube music tab by clicking the extension icon
chrome.action.onClicked.addListener(function (tab) {
    storeTabId(tab.id)
});


// handle media key press
chrome.commands.onCommand.addListener(async (command) => {
    let tabId = await getStoredTabId();

    // verify the existence of stored tab id
    if (tabId != null) {
        let tabExists = await exists(tabId)
        if (!tabExists) {
            tabId = null
        }
    }

    // if theres no verified tab stored, search for it
    if (tabId == null) {
        tabId = await findAndStoreCurrentYoutubeMusicTab();
    }

    // if nothing can be found, do nothing
    if (tabId == null) {
        return;
    }

    // dispatch the according key on the tab
    switch (command) {
        case "play-pause-media":
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: simulateSpaceKeyPress
            });
            break;
        case "next-media":
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: simulateRightArrowKeyPress
            });
            break;
        case "previous-media":
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: simulateLeftArrowKeyPress
            });
            break;
    }
});

chrome.tabs.onRemoved.addListener(async(tabId) => {
    let storedTabId = await getStoredTabId();
    console.log("delted tab", tabId);
    if (tabId == storedTabId) {
        chrome.storage.local.clear();
    }
});

// find and store the first valid music.youtube tab
function findAndStoreCurrentYoutubeMusicTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({}, function (tabs) {
            const tab = tabs.find((tab) => tab.url.startsWith("https://music.youtube.com/"))
            if (tab !== undefined) {
                storeTabId(tab.id)
                resolve(tab.id)
            }
        });
    })
}

function getStoredTabId() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["tabId"]).then((result) => {
            resolve(result.tabId);
        });
    })
}

function exists(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.query({}, function (tabs) {
            let result = tabs.some((tab) => tab.id == tabId);
            resolve(result);
        });
    })
}

function storeTabId(tabId) {
    chrome.storage.local.set({ tabId: tabId });
}

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