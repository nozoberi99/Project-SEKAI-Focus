import { atualizarVisibilidadeMusicas } from './procurarNome.js';

const rollOptions = Array.from(document.querySelectorAll('.roll-selection'));
const selectedRolls = new Set();

function updateRollSelection() {
    rollOptions.forEach((option) => {
        const isSelected = selectedRolls.has(option.dataset.value);
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
    });

    const noSelection = document.getElementById('roll-no-select');
    const isEmpty = selectedRolls.size === 0;
    noSelection?.classList.toggle('selected', isEmpty);
    noSelection?.setAttribute('aria-selected', String(isEmpty));
}

export function applyRollFilter() {
    document.querySelectorAll('.song').forEach((song) => {
        const matches = selectedRolls.size === 0 || selectedRolls.has(song.dataset.roll?.trim());
        song.dataset.rollMatch = String(matches);
    });
    atualizarVisibilidadeMusicas();
}

export function resetRollFilter() {
    selectedRolls.clear();
    updateRollSelection();
    document.querySelectorAll('.song').forEach((song) => {
        delete song.dataset.rollMatch;
    });
}

rollOptions.forEach((option) => {
    option.addEventListener('click', () => {
        if (option.id === 'roll-no-select') {
            selectedRolls.clear();
        } else if (selectedRolls.has(option.dataset.value)) {
            selectedRolls.delete(option.dataset.value);
        } else {
            selectedRolls.add(option.dataset.value);
        }
        updateRollSelection();
    });
});

updateRollSelection();
