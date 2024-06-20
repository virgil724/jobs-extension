console.log('background is running')
let tabData = []
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
  if (request.type === "104") {
    if (request.workDetail) {
      const tabId = sender.tab?.id;
      const workDetail = request.workDetail;

      // Create a new data object for the current tab
      const tabDataItem = { tabId, workDetail };

      // Add the new data object to the tabData array
      tabData.push(tabDataItem);

      // Save the entire tabData array in the session storage
      chrome.storage.session.set({ 'work': tabData }).then(() => {
        console.log(`Data saved for tab ${tabId}`);
      });
    }

  }
  if (request.type === 'getData') {
    sendResponse(tabData)
  }

  console.log(request)
  console.log(sender.tab?.id)
})




