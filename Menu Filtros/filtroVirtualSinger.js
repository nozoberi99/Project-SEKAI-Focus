import { atualizarVisibilidadeMusicas } from './procurarNome.js';

const singerOptions = Array.from(document.querySelectorAll('.vsing-selection'));
const selectedSingers = new Set();
const singerAliases = {
    miku: ['hatsune miku', 'miku hatsune'],
    rin: ['kagamine rin', 'rin kagamine'],
    len: ['kagamine len', 'len kagamine'],
    luka: ['megurine luka', 'luka megurine'],
    meiko: ['meiko'],
    kaito: ['kaito']
};

function updateSingerSelection() {
    singerOptions.forEach((option) => {
        const isSelected = selectedSingers.has(option.dataset.value);
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
        option.querySelector('img')?.classList.toggle('selected', isSelected);
    });

    const noSelection = document.getElementById('vsing-no-select');
    const isEmpty = selectedSingers.size === 0;
    noSelection?.classList.toggle('selected', isEmpty);
    noSelection?.setAttribute('aria-selected', String(isEmpty));
}

export function applyVirtualSingerFilter() {
    document.querySelectorAll('.song').forEach((song) => {
        const singerName = song.dataset.vs?.trim().toLowerCase();
        const matches = selectedSingers.size === 0
            || [...selectedSingers].some((singer) => singerAliases[singer]?.includes(singerName));
        song.dataset.vsingMatch = String(matches);
    });
    atualizarVisibilidadeMusicas();
}

export function resetVirtualSingerFilter() {
    selectedSingers.clear();
    updateSingerSelection();
    document.querySelectorAll('.song').forEach((song) => {
        delete song.dataset.vsingMatch;
    });
}

singerOptions.forEach((option) => {
    option.addEventListener('click', () => {
        if (option.id === 'vsing-no-select') {
            selectedSingers.clear();
        } else if (selectedSingers.has(option.dataset.value)) {
            selectedSingers.delete(option.dataset.value);
        } else {
            selectedSingers.add(option.dataset.value);
        }
        updateSingerSelection();
    });
});

updateSingerSelection();
