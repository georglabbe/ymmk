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
                function: dispatchPlayPause
            });
            break;
        case "next-media":
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: dispatchNextTrack
            });
            break;
        case "previous-media":
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                function: dispatchPrevTrack
            });
            break;
    }
});

// handle tab removal
chrome.tabs.onRemoved.addListener(async(tabId) => {
    let storedTabId = await getStoredTabId();
    // clear storage if stored tab has been deleted
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

// get the currently stored tab id
function getStoredTabId() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["tabId"]).then((result) => {
            resolve(result.tabId);
        });
    })
}

// check if given tab id exists
function exists(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.query({}, function (tabs) {
            let result = tabs.some((tab) => tab.id == tabId);
            resolve(result);
        });
    })
}

// store the given tab id
function storeTabId(tabId) {
    chrome.storage.local.set({ tabId: tabId });
}

// dispatches the key event to play/pause songs on youtube music
function dispatchPlayPause() {
    var playPauseKeyEvent = new KeyboardEvent("keydown", { key: "SPACE" });
    document.dispatchEvent(playPauseKeyEvent);
}

// dispatches the key event to play the next track on youtube music
function dispatchNextTrack() {
    var nextTrackKeyEvent = new KeyboardEvent("keydown", { key: "J" });
    document.dispatchEvent(nextTrackKeyEvent);
}

// dispatches the key event to play the previous track on youtube music
function dispatchPrevTrack() {
    var prevTrackKeyEvent = new KeyboardEvent("keydown", { key: "K" });
    document.dispatchEvent(prevTrackKeyEvent);
}