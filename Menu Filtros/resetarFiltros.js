import { resetRollFilter } from './filtroRoll.js';
import { resetVirtualSingerFilter } from './filtroVirtualSinger.js';
import { resetCharacterFilter } from './filtroPersonagem.js';
import { resetEventFilter } from './filtroEvento.js';
import { resetMvFilter } from './filtroMv.js';
import { resetUnitFilter } from './filtroUnit.js';

const resetButton = document.getElementById('erase-button');

resetButton?.addEventListener('click', () => {
    const nameInput = document.getElementById('name-input');

    if (nameInput) {
        nameInput.value = '';
    }

    resetRollFilter();
    resetVirtualSingerFilter();
    resetCharacterFilter();
    resetEventFilter();
    resetMvFilter();
    resetUnitFilter();
    document.getElementById('filter-button')?.classList.remove('filters-applied');
});
