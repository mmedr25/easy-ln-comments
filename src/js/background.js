// open config page
const openConfigPage = () => {
    browser.runtime.openOptionsPage();
}

// when you click on the plugin icon
chrome.browserAction.onClicked.addListener(() => {
    openConfigPage()
});

// when the plugin is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
    openConfigPage()
});