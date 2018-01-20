init();

async function init() {
    renderColorMarkIfHostExistsForCurrenLocation(window.location.host);
}

async function renderColorMarkIfHostExistsForCurrenLocation(currentLocationHost) {
    const hosts = await getStoredHosts();

    console.log(currentLocationHost);
    hosts.forEach((host) => {
        if(currentLocationHost.includes(host.name)) {
            console.log('match found!', currentLocationHost);
            renderColorMark(host);
            return renderStyle();
        }
    });

}

function getStoredHosts() {
    return new Promise((resolve) => {
        chrome.storage.sync.get((data) => {
            resolve(chrome.runtime.lastError ? null : data.hosts || []);
        });
    });
}

function getStoredCSS() {
    return new Promise((resolve) => {
        chrome.storage.sync.get((data) => {
            resolve(chrome.runtime.lastError ? null : data.style);
        });
    });
}

function renderColorMark(host) {
    const body = document.getElementsByTagName("body")[0];
    const colormark = document.createElement("div");

    colormark.className = 'color-mark';
    colormark.innerHTML = `<span class="color-mark-title ${host.title}">${host.title}</span>`;
    colormark.style.background = host.color;

    body.insertBefore(colormark, body.firstChild);
}

async function renderStyle() {
    const css = await getStoredCSS();
    const style = document.createElement("style");
    const head = document.head || document.getElementsByTagName('head')[0];

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}
