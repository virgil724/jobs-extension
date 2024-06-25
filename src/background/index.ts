console.log('background is running')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
  }
  if (request.type === "saveData") {
    if (request.workDetail) {
      const tabId = sender.tab?.id || 0;
      const workDetail = request.workDetail;
      chrome.storage.session.get(['tabData'], function (result) {
        let tabData = result.tabData || {};
        tabData[tabId] = workDetail;

        chrome.storage.session.set({ tabData: tabData }, function () {
          console.log(`Data saved for tab ${tabId}`);
          sendResponse({ status: 'Data saved' });
        });
      });
    }

  }
  if (request.type === 'geocode') {
    const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json'
    const apiKey = '***REMOVED***'

    const addr = request.addr;

    chrome.storage.local.get(['addressCache'], function (result) {
      const addressCache = result.addressCache || {};

      if (addressCache[addr]) {

        sendResponse({ coords: addressCache[addr] });
      } else {
        fetch(`${geocodeUrl}?address=${encodeURIComponent(addr)}&key=${apiKey}`)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'OK') {
              const location = data.results[0].geometry.location;
              addressCache[addr] = location;

              chrome.storage.local.set({ addressCache: addressCache }, function () {
                sendResponse({ coords: location });
              });
            } else {
              sendResponse({ error: 'Geocoding failed' });
            }
          })
          .catch(error => {
            sendResponse({ error: error.message });
          });
      }
    });
    //我也不知道為什麼要return true
    return true
  }

})



chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.storage.session.get(['tabData'], function (result) {
    let tabData = result.tabData || {};
    if (tabData[tabId]) {
      delete tabData[tabId];

      chrome.storage.session.set({ tabData: tabData }, function () {
        console.log(`Data for tab ${tabId} removed`);

        chrome.runtime.sendMessage({ type: "updateJob" })


      });
    }
  });
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
