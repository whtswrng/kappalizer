$(() => init());

async function init() {
    renderStoredHosts();
    renderStoredStyle();

    $('#add-row').click(addRow);
    $('#customize').click(customize);

    $(document).on('click', '.remove', onRemove);

    $(document).on('change', '.color', onColorChange);

    $(document).on('keyup', '.style', onStyleChange);
    $(document).on('keyup', '.host', onHostChange);
    $(document).on('keyup', '.title', onTitleChange);
}

async function renderStoredHosts() {
    const storedHosts = await getStoredHosts();

    $('tbody').empty();

    if(storedHosts.length === 0) {
        await addRow();
    }

    _.each(storedHosts, (host, index) => {
        renderRow(host.name, host.title, host.color, index);
    });
}

async function renderStoredStyle() {
    const storedStyle = await getStoredStyle();

    if(storedStyle) {
        $('.style').empty();
        $('.style').val(storedStyle);
    }
}

function getStoredHosts() {
    return new Promise((resolve) => {
        chrome.storage.sync.get((data) => {
            resolve(chrome.runtime.lastError ? null : _.get(data, 'hosts', []));
        });
    });
}

function getStoredStyle() {
    return new Promise((resolve) => {
        chrome.storage.sync.get((data) => {
            resolve(chrome.runtime.lastError ? null : _.get(data, 'style'));
        });
    });
}


function renderRow(name, title, color, index) {
    $('tbody').append(getRowWithHost(name, title, color, index));
}

function getRowWithHost(name, title, color, index) {
    return `
        <tr>
            <td data-title="Host"><input type="text" data-index="${index}" class="host" placeholder="host (localhost:49600)" value="${name}"/></td>
            <td data-title="Title"><input type="text" data-index="${index}" class="title" placeholder="title (development)" value="${title}"/></td>
            <td data-title="Status"><input type="color" data-index="${index}" class="color" placeholder="color" value="${color}"/></td>
            <td data-title="Status">
                <!--<button type="button" data-index="${index}" class="remove">x</button>-->
                <a data-index="${index}" class="btn-floating waves-effect waves-light red remove"><i class="material-icons">delete</i></a>

            </td>
        </tr>
    `;
}

function onHostChange() {
    const host = $(this).val();
    const index = $(this).data('index');
    const title = getTitle($(this));
    const color = getColor($(this));

    saveHost(host, title, color, index);
}

function onTitleChange() {
    const title = $(this).val();
    const index = $(this).data('index');
    const color = getColor($(this));
    const host = getHost($(this));

    saveHost(host, title, color, index);
}

function onColorChange() {
    const color = $(this).val();
    const index = $(this).data('index');
    const host = getHost($(this));
    const title = getTitle($(this));

    saveHost(host, title, color, index);
}

function onRemove() {
    const index = $(this).data('index');
    removeHost(index);
}

function onStyleChange() {
    const value = $(this).val();

    saveStyle(value);
}

function getTitle(element) {
    return element.parent().parent().find('.title').val();
}

function getHost(element) {
    return element.parent().parent().find('.host').val();
}

function getColor(element) {
    return element.parent().parent().find('.color').val();
}

async function addRow() {
    const host = '';
    const title = '';
    const color = '#ff00ff';
    const storedHosts = await getStoredHosts();
    const index = storedHosts.length;

    saveHost(host, title, color, index);
    renderRow(host, title, color, index);
}

async function customize() {
    $('.style-container').toggle();
}

async function saveHost(name, title, color, index) {
    const storedHosts = await getStoredHosts() || [];
    const data = {hosts: storedHosts};

    if(index !== undefined) {
        data.hosts[index] = {
            name,
            title,
            color
        };
    } else {
        data.hosts.push({
            name,
            title,
            color
        });
    }

    chrome.storage.sync.set(data);
}

async function removeHost(index) {
    const storedHosts = await getStoredHosts() || [];
    const data = {hosts: storedHosts};

    data.hosts.splice(index, 1);

    chrome.storage.sync.set(data);
    renderStoredHosts()
}

async function saveStyle(style) {
    const storedHosts = await getStoredHosts() || [];
    const data = {hosts: storedHosts, style};

    chrome.storage.sync.set(data);
}
