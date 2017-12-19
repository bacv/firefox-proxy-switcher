/* exported FindProxyForURL */

const direct = "DIRECT";
const proxied = [{
    type: "socks",
    host: "localhost",
    port: 9991,
    proxyDNS: true
}];

var isPoxied;
// tell the background script that we are ready
browser.runtime.sendMessage("init");

// listen for updates to the blocked host list
browser.runtime.onMessage.addListener((message) => {
  isPoxied = message;
});

// required PAC function that will be called to determine
// if a proxy should be used.
function FindProxyForURL(url, host) {
  if (!isPoxied) {
    return direct;
  }
  return proxied;
}
