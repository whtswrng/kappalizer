// document.addEventListener('DOMContentLoaded', replaceNames, false);
replaceNames();

async function replaceNames() {
    console.log('go?')
    // const names = await getStoredNames();

    start();
}

function start() {
    const results = [];

    nativeSelector();
    let _nv;
    for (let i = 0, len = results.length; i<len; i++){
        _nv = results[i].nodeValue;
        doReplaceNames();
        results[i].nodeValue = _nv;
    }

    function doReplaceNames() {
        replaceBabis();
        replaceOkamura();
        replaceSobotka();
        replaceRozner();
        replaceKalousek();
        replaceZeman();
        replaceChovanec();
        replaceOvcacek();
        replacePelikan();
        replaceSlechtova();
        replaceBartos();
        replaceDrahos();
    }

    function replaceBabis() {
        _nv = _nv.replace(/Babiš/gmu, 'Hrabiš');
        // _nv = _nv.replace(/Kokote/gmu, 'Kokota');
    }

    function replaceOkamura() {
        _nv = _nv.replace(/Okamur/gmu, 'Ban');
        _nv = _nv.replace(/Bana/gmu, 'Ban');
        _nv = _nv.replace(/Bany|Banu/gmu, 'Bana');
        _nv = _nv.replace(/Banou/gmu, 'Banem');
    }

    function replaceSobotka() {
        _nv = _nv.replace(/Sobotk/gmu, 'Srábotk');
    }

    function replaceRozner() {
        _nv = _nv.replace(/Roznera|Roznerovi|Roznerovy|Rozneru|Rozner/gmu, 'Určitěmožná');
    }

    function replaceKalousek() {
        _nv = _nv.replace(/Kalousek/gmu, 'Koloušek');
        _nv = _nv.replace(/Kalousk/gmu, 'Koloušk');
    }

    function replaceZeman() {
        _nv = _nv.replace(/Zeman/gmu, 'Bablbam');
    }

    function replaceChovanec() {
        _nv = _nv.replace(/Chovanec/gmu, 'Troufalec');
        _nv = _nv.replace(/Chovanc/gmu, 'Troufalc');
    }

    function replacePelikan() {
        _nv = _nv.replace(/Pelikán/gmu, 'Hurikán');
    }

    function replaceSlechtova() {
        _nv = _nv.replace(/Šlechtov/gmu, 'Šlachov');
    }

    function replaceOvcacek() {
        _nv = _nv.replace(/Ovčáček/gmu, 'Dobrmánek');
        _nv = _nv.replace(/Ovčáčk/gmu, 'Dobrmánk');
    }

    function replaceBartos() {
        _nv = _nv.replace(/Bartoš/gmu, 'Dredař');
    }

    function replaceDrahos() {
        _nv = _nv.replace(/Drahoš/gmu, 'Neprezident');
        _nv = _nv.replace(/Neprezidente/gmu, 'Neprezidenta');
        _nv = _nv.replace(/Neprezidentam/gmu, 'Neprezidentem');
    }

    function nativeSelector() {
        const elements = document.querySelectorAll("body, body *");
        for(let i = 0; i < elements.length; i++) {
            filterChildNodes(elements[i].childNodes)
        }
    }

    function filterChildNodes(childNodes) {
        for(let i = 0; i < childNodes.length; i++) {
            if(childNodes[i].nodeType === 3) {
                results.push(childNodes[i]);
            }
        }

    }

}


function getStoredNames() {
    return new Promise((resolve) => {
        chrome.storage.sync.get((data) => {
            resolve(chrome.runtime.lastError ? null : data.names || []);
        });
    });
}

