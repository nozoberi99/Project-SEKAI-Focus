import { resetRollFilter } from './filtroRoll.js';
import { resetVirtualSingerFilter } from './filtroVirtualSinger.js';
import { resetEventFilter } from './filtroEvento.js';
import { resetMvFilter } from './filtroMv.js';

const resetButton = document.getElementById('erase-button');

function resetFranchiseSelection() {
    document.querySelectorAll('.multiOpcao-option input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
        checkbox.indeterminate = false;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
}

function resetSortSelection() {
    const sortSelect = document.getElementById('sort-select');
    const sortDirection = document.getElementById('sort-descending');
    const sortTriggerText = document.querySelector('#sort-trigger .multiOpcao-trigger-text');
    const sortOptions = document.querySelectorAll('.sort-option');
    const defaultOption = document.querySelector('.sort-option[data-value="default"]');

    if (sortSelect) {
        sortSelect.value = 'default';
    }

    if (sortDirection) {
        sortDirection.checked = false;
    }

    if (sortTriggerText && defaultOption) {
        sortTriggerText.textContent = defaultOption.textContent;
    }

    sortOptions.forEach((option) => {
        option.setAttribute('aria-selected', String(option === defaultOption));
    });
}

resetButton?.addEventListener('click', () => {
    const nameInput = document.getElementById('name-input');

    if (nameInput) {
        nameInput.value = '';
    }

    document.getElementById('year-no-select')?.click();
    document.getElementById('color-no-select')?.click();
    document.getElementById('sign-no-select')?.click();
    resetFranchiseSelection();
    resetSortSelection();
    resetRollFilter();
    resetVirtualSingerFilter();
    resetEventFilter();
    resetMvFilter();
});
