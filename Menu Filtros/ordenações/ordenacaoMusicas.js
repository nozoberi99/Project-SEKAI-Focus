import { ordenarPorPersonagem } from './ordenacaoPadrao.js';
import { ordenarPorNome } from './ordenacaoNome.js';
import { agruparPorUnit } from './ordenacaoUnit.js';
import { agruparPorVirtualSinger } from './ordenacaoVirtualSinger.js';
import { agruparPorRoll } from './ordenacaoRoll.js';

const select = document.getElementById('sort-select');
const menu = document.getElementById('sort-menu');
const sortTrigger = document.getElementById('sort-trigger');
const sortOptions = document.getElementById('sort-options');
const descendingCheckbox = document.getElementById('sort-descending');
const sortStorageKey = 'project-sekai-focus-sort';
const defaultSort = { value: 'release', descending: false };

function toggleSortMenu(isOpen) {
    sortOptions?.classList.toggle('show', isOpen);
    sortTrigger?.classList.toggle('opened', isOpen);
    sortTrigger?.setAttribute('aria-expanded', String(isOpen));
}

sortTrigger?.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleSortMenu(!sortOptions?.classList.contains('show'));
});

document.addEventListener('click', (event) => {
    if (menu && !menu.contains(event.target)) {
        toggleSortMenu(false);
    }
});
const originalGroups = Array.from(document.querySelectorAll('.character-focus'));
const unitFilterKeys = {
    'leo/need': 'leoni',
    'more more jump!': 'mmj',
    'vivid bad squad': 'vbs',
    'wonderlands x showtime': 'wxs',
    '25ji, nightcord de.': 'niigo'
};
const virtualSingerTitles = {
    'MEIKO': 'MEIKO',
    'Megurine Luka': 'Megurine Luka',
    'Hatsune Miku': 'Hatsune Miku',
    'KAITO': 'KAITO',
    'Kagamine Len': 'Kagamine Len',
    'Kagamine Rin': 'Kagamine Rin'
};
const rollTitles = {
    '1': 'Primeiro',
    '2': 'Segundo',
    '3': 'Terceiro',
    '4': 'Quarto',
    '5': 'Quinto',
    '6': 'Sexto',
    '7': 'Sétimo'
};
const characterTitles = Object.fromEntries(
    Array.from(document.querySelectorAll('.char-selection[data-value]')).map((option) => [
        option.dataset.value,
        option.dataset.charLabel || option.dataset.value
    ])
);
const items = Array.from(document.querySelectorAll('.song')).map((element, index) => ({
    element,
    originalIndex: index,
    personagem: element.dataset.character || '',
    nome: element.dataset.tooltip?.trim() || '',
    unit: element.dataset.unit?.trim() || '',
    virtualSinger: element.dataset.vs?.trim() || '',
    roll: element.dataset.roll?.trim() || '',
    lancamento: element.dataset.release?.trim() || ''
}));

items.forEach(({ element, unit, personagem }) => {
    element.dataset.filterUnit = unit;
    element.dataset.filterUnitKey = unitFilterKeys[unit.toLowerCase()] || unit.toLowerCase();
    element.dataset.filterCharacter = element.dataset.character || personagem;
});

const globalList = document.getElementById('all-songs');

function dataSort(a, b) {
    const first = Date.parse(a.lancamento.split('-').reverse().join('-')) || 0;
    const second = Date.parse(b.lancamento.split('-').reverse().join('-')) || 0;
    return first - second || a.originalIndex - b.originalIndex;
}

function updateMenu(value) {
    menu?.querySelectorAll('.sort-option').forEach((option) => {
        const selected = option.dataset.value === value;
        option.setAttribute('aria-selected', String(selected));
        option.classList.toggle('selected', selected);
        if (selected) menu.querySelector('.multiOpcao-trigger-text').textContent = option.textContent;
    });
}

function saveSortPreference() {
    localStorage.setItem(sortStorageKey, JSON.stringify({
        value: select?.value || defaultSort.value,
        descending: Boolean(descendingCheckbox?.checked)
    }));
}

function loadSortPreference() {
    let preference;

    try {
        preference = JSON.parse(localStorage.getItem(sortStorageKey) || 'null');
    } catch {
        preference = null;
    }

    const storedValue = preference?.value;
    const value = storedValue && select?.querySelector(`option[value="${storedValue}"]`)
        ? storedValue
        : defaultSort.value;
    const descending = typeof preference?.descending === 'boolean'
        ? preference.descending
        : defaultSort.descending;

    if (select) {
        select.value = value;
    }
    if (descendingCheckbox) {
        descendingCheckbox.checked = descending;
    }
    updateMenu(value);
}

function idDoHeader(label, tipo) {
    const slug = label
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return `sort-${tipo}-${slug}`;
}

function header(label, count, tipo) {
    const element = document.createElement('li');
    element.className = 'sort-header';
    element.id = idDoHeader(label, tipo);
    element.textContent = `${label} (${count})`;
    return element;
}

function headerHasVisibleSongs(headerElement) {
    let sibling = headerElement.nextElementSibling;

    while (sibling && !sibling.classList.contains('sort-header')) {
        if (sibling.classList.contains('song') && !sibling.hidden && sibling.style.display !== 'none') {
            return true;
        }
        sibling = sibling.nextElementSibling;
    }

    return false;
}

function atualizarNavegacao(value) {
    const headers = value === 'name' || value === 'release'
        ? []
        : Array.from(globalList.querySelectorAll('.sort-header')).filter((headerElement) => {
            const hasVisibleSongs = headerHasVisibleSongs(headerElement);
            headerElement.hidden = !hasVisibleSongs;
            return hasVisibleSongs;
        });

    window.dispatchEvent(new CustomEvent('sort-navigation-update', {
        detail: { tipo: value, headers }
    }));
}

function notifySongsReordered() {
    window.dispatchEvent(new CustomEvent('songs-reordered'));
}

export function render() {
    const value = select?.value || 'default';
    const descending = descendingCheckbox?.checked;
    const ordered = value === 'name'
        ? ordenarPorNome(items)
        : value === 'default'
            ? items.slice()
            : ordenarPorPersonagem(items).sort(dataSort);

    originalGroups.forEach((group) => {
        group.hidden = value !== 'default';
        group.querySelectorAll('.character-name').forEach((title) => {
            title.hidden = value !== 'default';
        });
    });
    globalList.replaceChildren();

    if (value === 'default') {
        const visibleItems = ordered.filter((item) => !item.element.hidden && item.element.style.display !== 'none');
        const hiddenItems = ordered.filter((item) => item.element.hidden || item.element.style.display === 'none');
        const groups = new Map();

        visibleItems.forEach((item) => {
            const character = item.personagem || 'unknown';
            if (!groups.has(character)) {
                groups.set(character, []);
            }
            groups.get(character).push(item);
        });

        if (descending) {
            const reversed = [...groups].reverse();
            groups.clear();
            reversed.forEach(([key, group]) => groups.set(key, group.slice().reverse()));
        }

        groups.forEach((group, character) => {
            const label = characterTitles[character] || character;
            globalList.append(header(label, group.length, 'default'));
            group.forEach((item) => globalList.append(item.element));
        });
        hiddenItems.forEach((item) => globalList.append(item.element));
        atualizarNavegacao(value);
        notifySongsReordered();
        return;
    }

    const visibleItems = ordered.filter((item) => !item.element.hidden && item.element.style.display !== 'none');
    const hiddenItems = ordered.filter((item) => item.element.hidden || item.element.style.display === 'none');

    if (value === 'release') {
        const releaseItems = visibleItems.slice().sort(dataSort);
        const releaseOrdered = descending ? releaseItems.reverse() : releaseItems;
        releaseOrdered.forEach((item) => globalList.append(item.element));
        hiddenItems.forEach((item) => globalList.append(item.element));
        atualizarNavegacao(value);
        notifySongsReordered();
        return;
    }

    const groups = value === 'unit' ? agruparPorUnit(visibleItems)
        : value === 'vs' ? agruparPorVirtualSinger(visibleItems)
            : value === 'roll' ? agruparPorRoll(visibleItems)
                : new Map([['', visibleItems]]);

    if (value === 'name') {
        const nameItems = descending ? visibleItems.slice().reverse() : visibleItems;
        nameItems.forEach((item) => globalList.append(item.element));
        hiddenItems.forEach((item) => globalList.append(item.element));
        atualizarNavegacao(value);
        notifySongsReordered();
        return;
    }

    if (descending) {
        const reversed = [...groups].reverse();
        groups.clear();
        reversed.forEach(([key, group]) => groups.set(key, group.slice().reverse()));
    }

    groups.forEach((group, label) => {
        const displayLabel = value === 'roll'
            ? rollTitles[label] || label
            : value === 'vs'
                ? virtualSingerTitles[label] || label
                : label;
        globalList.append(header(displayLabel, group.length, value));
        group.forEach((item) => globalList.append(item.element));
    });

    hiddenItems.forEach((item) => globalList.append(item.element));
    atualizarNavegacao(value);
    notifySongsReordered();
}

menu?.querySelectorAll('.sort-option').forEach((option) => {
    option.addEventListener('click', () => {
        select.value = option.dataset.value;
        updateMenu(select.value);
        saveSortPreference();
        render();
    });
});

descendingCheckbox?.addEventListener('change', () => {
    saveSortPreference();
    render();
});

document.getElementById('search-button')?.addEventListener('click', render);
window.addEventListener('sort-reset', () => {
    if (select) {
        select.value = defaultSort.value;
    }
    if (descendingCheckbox) {
        descendingCheckbox.checked = defaultSort.descending;
    }
    updateMenu(defaultSort.value);
    saveSortPreference();
    render();
});
window.addEventListener('filters-updated', () => {
    render();
});
loadSortPreference();
render();
