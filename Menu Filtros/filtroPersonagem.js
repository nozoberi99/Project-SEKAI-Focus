import { atualizarVisibilidadeMusicas } from './procurarNome.js';

const characterOptions = Array.from(document.querySelectorAll('.char-selection'));
const selectedCharacters = new Set();

function updateCharacterSelection() {
    characterOptions.forEach((option) => {
        const isSelected = selectedCharacters.has(option.dataset.value);
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
        option.querySelector('img')?.classList.toggle('selected', isSelected);
    });

    const noSelection = document.getElementById('char-no-select');
    const isEmpty = selectedCharacters.size === 0;
    noSelection?.classList.toggle('selected', isEmpty);
    noSelection?.setAttribute('aria-selected', String(isEmpty));
}

export function applyCharacterFilter() {
    document.querySelectorAll('.song').forEach((song) => {
        const character = song.dataset.character?.trim().toLowerCase();
        const matches = selectedCharacters.size === 0 || selectedCharacters.has(character);
        song.dataset.characterMatch = String(matches);
    });
    atualizarVisibilidadeMusicas();
}

export function resetCharacterFilter() {
    selectedCharacters.clear();
    updateCharacterSelection();
    document.querySelectorAll('.song').forEach((song) => {
        delete song.dataset.characterMatch;
    });
}

characterOptions.forEach((option) => {
    option.addEventListener('click', () => {
        if (option.id === 'char-no-select') {
            selectedCharacters.clear();
        } else if (selectedCharacters.has(option.dataset.value)) {
            selectedCharacters.delete(option.dataset.value);
        } else {
            selectedCharacters.add(option.dataset.value);
        }
        updateCharacterSelection();
    });
});

updateCharacterSelection();
