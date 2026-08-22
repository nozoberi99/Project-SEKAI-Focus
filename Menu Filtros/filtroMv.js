import { atualizarVisibilidadeMusicas } from './procurarNome.js';

const mvOptions = Array.from(document.querySelectorAll('.mv-selection'));
let selectedMv = '';

function updateMvSelection() {
    mvOptions.forEach((option) => {
        const isSelected = option.dataset.value === selectedMv;
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
    });

    const noSelection = document.getElementById('mv-no-select');
    const isEmpty = selectedMv === '';
    noSelection?.classList.toggle('selected', isEmpty);
    noSelection?.setAttribute('aria-selected', String(isEmpty));
}

export function applyMvFilter() {
    document.querySelectorAll('.song').forEach((song) => {
        const matches = selectedMv === '' || Boolean(song.dataset[selectedMv]);
        song.dataset.mvMatch = String(matches);
    });
    atualizarVisibilidadeMusicas();
}

export function resetMvFilter() {
    selectedMv = '';
    updateMvSelection();
    document.querySelectorAll('.song').forEach((song) => {
        delete song.dataset.mvMatch;
    });
}

mvOptions.forEach((option) => {
    option.addEventListener('click', () => {
        selectedMv = option.id === 'mv-no-select' ? '' : option.dataset.value || '';
        updateMvSelection();
    });
});

updateMvSelection();
