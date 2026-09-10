import { atualizarVisibilidadeMusicas } from './procurarNome.js';
import { updateResultsState } from './estadoResultados.js';

const unitButtons = Array.from(document.querySelectorAll('.unit-button'));
const selectedUnits = new Set();

function updateUnitBackground() {
    const selectedUnit = selectedUnits.size === 1 ? [...selectedUnits][0] : '';
    document.body.dataset.selectedUnit = selectedUnit;
}

function updateUnitSelection() {
    unitButtons.forEach((button) => {
        const selected = selectedUnits.has(button.id);
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
    });
}

export function applyUnitFilter() {
    document.querySelectorAll('.song').forEach((song) => {
        const matches = selectedUnits.size === 0 || selectedUnits.has(song.dataset.filterUnitKey);
        song.dataset.unitMatch = String(matches);
    });
    atualizarVisibilidadeMusicas();
    updateResultsState();
}

export function resetUnitFilter() {
    selectedUnits.clear();
    updateUnitSelection();
    updateUnitBackground();
    document.querySelectorAll('.song').forEach((song) => {
        delete song.dataset.unitMatch;
    });
}

unitButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (selectedUnits.has(button.id)) {
            selectedUnits.delete(button.id);
        } else {
            selectedUnits.add(button.id);
        }

        updateUnitSelection();
        updateUnitBackground();
        applyUnitFilter();
    });
});

updateUnitSelection();
updateUnitBackground();
