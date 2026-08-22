import { ordenarPorPersonagem } from './ordenacaoPadrao.js';
import { ordenarPorNome } from './ordenacaoNome.js';
import { agruparPorUnit } from './ordenacaoUnit.js';
import { agruparPorVirtualSinger } from './ordenacaoVirtualSinger.js';
import { agruparPorRoll } from './ordenacaoRoll.js';
import { agruparPorLancamento } from './ordenacaoLancamento.js';
import { replayEntranceAnimations } from '../animacoesEntrada.js';

const select = document.getElementById('sort-select');
const menu = document.getElementById('sort-menu');
const descendingCheckbox = document.getElementById('sort-descending');
const originalGroups = Array.from(document.querySelectorAll('.character-focus'));
const groupHeaderTitles = {
    unit: 'Unit',
    vs: 'Virtual Singer',
    roll: 'Roll',
    release: 'Ano'
};
const unitTitles = {
    leoni: 'Leo/need'
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
const items = Array.from(document.querySelectorAll('.song')).map((element, index) => ({
    element,
    originalIndex: index,
    originalList: element.closest('.character-focus')?.querySelector('.focus-songs'),
    personagem: element.closest('.character-focus')?.querySelector('.character-name')?.textContent.trim() || '',
    nome: element.dataset.tooltip?.trim() || '',
    unit: element.closest('.character-focus')?.dataset.unit || '',
    virtualSinger: element.dataset.vs?.trim() || '',
    roll: element.dataset.roll?.trim() || '',
    lancamento: element.dataset.release?.trim() || ''
}));

items.forEach(({ element, unit, personagem }) => {
    element.dataset.filterUnit = unit;
    element.dataset.filterUnitKey = unit.toLowerCase() === 'leo/need' ? 'leoni' : unit.toLowerCase();
    element.dataset.filterCharacter = element.closest('.character-focus')?.querySelector('.character-name')?.id || personagem;
});

const globalList = document.createElement('ul');
globalList.className = 'focus-songs sorted-songs';
globalList.hidden = true;
originalGroups.at(-1)?.after(globalList);

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

function header(label, count) {
    const element = document.createElement('li');
    element.className = 'sort-header';
    element.textContent = `${label} (${count})`;
    return element;
}

export function render() {
    const value = select?.value || 'default';
    const descending = descendingCheckbox?.checked;
    const ordered = value === 'name' ? ordenarPorNome(items) : ordenarPorPersonagem(items).sort(dataSort);

    originalGroups.forEach((group) => {
        if (value !== 'default') group.hidden = true;
        group.querySelectorAll('.character-name').forEach((title) => {
            title.hidden = value !== 'default';
        });
    });
    globalList.hidden = value === 'default';
    globalList.replaceChildren();

    if (value === 'default') {
        const defaultItems = descending ? ordered.slice().reverse() : ordered;
        defaultItems.forEach((item) => item.originalList?.append(item.element));
        originalGroups.forEach((group) => {
            const hasVisibleCard = Array.from(group.querySelectorAll('.song'))
                .some((song) => !song.hidden && song.style.display !== 'none');
            group.hidden = !hasVisibleCard;
            group.style.display = group.hidden ? 'none' : '';
        });
        replayEntranceAnimations();
        return;
    }

    const visibleItems = ordered.filter((item) => !item.element.hidden && item.element.style.display !== 'none');
    const hiddenItems = ordered.filter((item) => item.element.hidden || item.element.style.display === 'none');
    const groups = value === 'unit' ? agruparPorUnit(visibleItems)
        : value === 'vs' ? agruparPorVirtualSinger(visibleItems)
            : value === 'roll' ? agruparPorRoll(visibleItems)
                : value === 'release' ? agruparPorLancamento(visibleItems)
                    : new Map([['', visibleItems]]);

    if (value === 'name') {
        const nameItems = descending ? visibleItems.slice().reverse() : visibleItems;
        nameItems.forEach((item) => globalList.append(item.element));
        hiddenItems.forEach((item) => globalList.append(item.element));
        replayEntranceAnimations();
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
            : value === 'release'
                ? `Ano ${label}`
                : label;
        globalList.append(header(displayLabel, group.length));
        group.forEach((item) => globalList.append(item.element));
    });

    hiddenItems.forEach((item) => globalList.append(item.element));
    replayEntranceAnimations();
}

menu?.querySelectorAll('.sort-option').forEach((option) => {
    option.addEventListener('click', () => {
        select.value = option.dataset.value;
        updateMenu(select.value);
    });
});

document.getElementById('search-button')?.addEventListener('click', render);
updateMenu('default');
