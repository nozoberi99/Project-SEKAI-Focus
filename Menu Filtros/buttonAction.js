import { atualizarVisibilidadeMusicas, filtrarPersonagens } from './procurarNome.js';
import { updateResultsState } from './estadoResultados.js';
import { applyRollFilter } from './filtroRoll.js';
import { applyVirtualSingerFilter } from './filtroVirtualSinger.js';
import { applyEventFilter } from './filtroEvento.js';
import { applyMvFilter } from './filtroMv.js';

export function applyFranchiseFilter() {
    const selectedCharacters = Array.from(document.querySelectorAll('.multiOpcao-child input[type="checkbox"], .multiOpcao-parent-checkbox'))
        .filter((checkbox) => checkbox.checked)
        .flatMap((checkbox) => [
            checkbox.dataset.sectionId,
            checkbox.dataset.sectionClass,
            checkbox.dataset.label,
            checkbox.value,
            checkbox.closest('.multiOpcao-parent')?.querySelector('span')?.textContent
        ])
        .filter(Boolean)
        .map((value) => value.trim().toLowerCase());

    const sections = document.querySelectorAll('.character-focus');

    document.querySelectorAll('.song').forEach((song) => {
        const selected = selectedCharacters.length === 0 || selectedCharacters.some((character) =>
            [song.dataset.filterUnit, song.dataset.filterUnitKey, song.dataset.filterCharacter]
                .filter(Boolean)
                .map((value) => value.trim().toLowerCase())
                .includes(character)
        );
        song.dataset.franchiseMatch = String(selected);
    });

    sections.forEach((section) => {
        const characterId = section.querySelector('.character-name')?.id;
        const matchesCharacter = selectedCharacters.length === 0
            || selectedCharacters.some((character) => section.classList.contains(character) || characterId?.toLowerCase() === character);
        const matchesUnit = selectedCharacters.length === 0
            || selectedCharacters.includes(section.dataset.unit?.trim().toLowerCase());

        section.querySelectorAll('.song').forEach((song) => {
            song.dataset.franchiseMatch = String(matchesCharacter || matchesUnit);
        });

        const shouldShow = selectedCharacters.length === 0 || matchesCharacter || matchesUnit;
        section.hidden = !shouldShow;
        section.style.display = shouldShow ? '' : 'none';
    });

    atualizarVisibilidadeMusicas();

}

export function applySearchAction(callback) {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (typeof callback === 'function') {
        callback();
    }

    applyRollFilter();
    applyVirtualSingerFilter();
    applyEventFilter();
    applyMvFilter();
    applyFranchiseFilter();
    updateResultsState();
}

export function initSearchButtonBehavior(searchButton, callback) {
    if (!searchButton) {
        return;
    }

    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        applySearchAction(callback);
    });
}

initSearchButtonBehavior(document.getElementById('search-button'), filtrarPersonagens);
