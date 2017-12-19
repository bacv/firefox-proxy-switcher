const proxyScriptURL = "proxy/proxy-script.js";

browser.proxy.register(proxyScriptURL);

// Log any errors from the proxy script
browser.proxy.onProxyError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

const defaultSettings = {
	isProxied: false
}

function handleInit() {
  // update the proxy whenever stored settings change
  browser.storage.onChanged.addListener((newSettings) => {
    browser.runtime.sendMessage(newSettings.isProxied.newValue, {toProxyScript: true});
  });

  // get the current settings, then...
  browser.storage.local.get()
    .then((storedSettings) => {
      // if there are stored settings, update the proxy with them...
      if (storedSettings.isProxied) {
        browser.runtime.sendMessage(storedSettings.isProxied, {toProxyScript: true});
		browser.browserAction.setIcon({path:"icons/block-green.svg"});
      // ...otherwise, initialize storage with the default values
      } else {
        browser.storage.local.set(defaultSettings);
		browser.browserAction.setIcon({path:"icons/block.svg"});
      }

    })
    .catch(()=> {
      console.log("Error retrieving stored settings");
    });
}

function handleMessage(message, sender) {
  // only handle messages from the proxy script
  if (sender.url !=  browser.extension.getURL(proxyScriptURL)) {
    return;
  }

  if (message === "init") {
    handleInit(message);
  }
}

function toggleProxy() {
  	browser.storage.local.get()
	    .then((storedSettings) => {
	      // if there are stored settings, update the proxy with them...
			if (storedSettings.isProxied) {
				browser.browserAction.setIcon({path:"icons/block.svg"});
			} else {
				browser.browserAction.setIcon({path:"icons/block-green.svg"});
			}
			
			// browser.runtime.sendMessage(!storedSettings.isProxied, {toProxyScript: true});
			browser.storage.local.set({isProxied: !storedSettings.isProxied});
	    })
	    .catch(()=> {
	      console.log("Error retrieving stored settings");
	    });

}

browser.runtime.onMessage.addListener(handleMessage);
browser.browserAction.onClicked.addListener(toggleProxy);