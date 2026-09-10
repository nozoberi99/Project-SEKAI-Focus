import { filtrarPersonagens } from './procurarNome.js';
import { updateResultsState } from './estadoResultados.js';
import { applyRollFilter } from './filtroRoll.js';
import { applyVirtualSingerFilter } from './filtroVirtualSinger.js';
import { applyCharacterFilter } from './filtroPersonagem.js';
import { applyEventFilter } from './filtroEvento.js';
import { applyMvFilter } from './filtroMv.js';

function updateFilterButtonState() {
    const hasAppliedFilter = [
        ...document.querySelectorAll('.char-selection.selected:not(#char-no-select), .vsing-selection.selected:not(#vsing-no-select), .roll-selection.selected:not(#roll-no-select), .event-selection.selected:not(#event-no-select), .mv-selection.selected:not(#mv-no-select)')
    ].length > 0
        || document.querySelectorAll('.unit-button.selected').length > 0;

    document.getElementById('filter-button')?.classList.toggle('filters-applied', hasAppliedFilter);
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
    applyCharacterFilter();
    applyEventFilter();
    applyMvFilter();
    updateResultsState();
    updateFilterButtonState();
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

document.getElementById('name-input')?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    event.preventDefault();
    applySearchAction(filtrarPersonagens);
});
