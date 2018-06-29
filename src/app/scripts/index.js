$(() => init());

async function init() {
    renderStoredNames();

    $('#add-row').click(addRow);

    $(document).on('click', '.remove', onRemove);

    $(document).on('keyup', '.name', onHostChange);
    $(document).on('keyup', '.alternativeName', onTitleChange);
}

async function renderStoredNames() {
    const storedNames = await getStoredNames();

    $('tbody').empty();

    if(storedNames.length === 0) {
        await addRow();
    }

    _.each(storedNames, (name, index) => {
        renderRow(name.name, name.alternativeName, index);
    });
}

function getStoredNames() {
    return new Promise((resolve) => {
        chrome.storage.sync.get((data) => {
            resolve(chrome.runtime.lastError ? null : _.get(data, 'names', []));
        });
    });
}


function renderRow(name, alternativeName, index) {
    $('tbody').append(getRow(name, alternativeName, index));
}

function getRow(name, alternativeName, index) {
    return `
        <tr>
            <td data-alternativeName="Host"><input type="text" data-index="${index}" class="name" placeholder="Zeman" value="${name}"/></td>
            <td data-alternativeName="Title"><input type="text" data-index="${index}" class="alternativeName" placeholder="Bablbam" value="${alternativeName}"/></td>
            <td data-alternativeName="Status">
                <!--<button type="button" data-index="${index}" class="remove">x</button>-->
                <a data-index="${index}" class="btn-floating waves-effect waves-light red remove"><i class="material-icons">delete</i></a>

            </td>
        </tr>
    `;
}

function onHostChange() {
    const name = $(this).val();
    const index = $(this).data('index');
    const alternativeName = getTitle($(this));

    saveName(name, alternativeName, index);
}

function onTitleChange() {
    const alternativeName = $(this).val();
    const index = $(this).data('index');
    const name = getHost($(this));

    saveName(name, alternativeName, index);
}

function onRemove() {
    const index = $(this).data('index');
    removeName(index);
}

function getTitle(element) {
    return element.parent().parent().find('.alternativeName').val();
}

function getHost(element) {
    return element.parent().parent().find('.name').val();
}

async function addRow() {
    const name = '';
    const alternativeName = '';
    const storedNames = await getStoredNames();
    const index = storedNames.length;

    saveName(name, alternativeName, index);
    renderRow(name, alternativeName, index);
}

async function saveName(name, alternativeName, index) {
    const storedNames = await getStoredNames() || [];
    const data = {names: storedNames};

    if(index !== undefined) {
        data.names[index] = {
            name,
            alternativeName
        };
    } else {
        data.names.push({
            name,
            alternativeName
        });
    }

    chrome.storage.sync.set(data);
}

async function removeName(index) {
    const storedNames = await getStoredNames() || [];
    const data = {names: storedNames};

    data.names.splice(index, 1);

    chrome.storage.sync.set(data);
    renderStoredNames()
}

