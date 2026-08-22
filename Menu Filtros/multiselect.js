(function () {
    function initMultiselect(container = document.querySelector('.multiOpcao'), config = {}) {
        if (!container) {
            return;
        }

        const trigger = container.querySelector(config.triggerSelector || '.multiOpcao-trigger');
        const options = container.querySelector(config.optionsSelector || '.multiOpcao-options');
        const text = container.querySelector(config.textSelector || '.multiOpcao-trigger-text');
        const checkboxes = container.querySelectorAll(config.checkboxSelector || ".multiOpcao-option input[type='checkbox']");

        if (!trigger || !options || !text) {
            return;
        }

        function updateSelection() {
            const selectableCheckboxes = Array.from(checkboxes).filter((checkbox) => !checkbox.classList.contains('multiOpcao-parent-checkbox'));
            const selected = selectableCheckboxes
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.dataset.label || checkbox.parentElement.textContent.trim());

            const parentGroups = Array.from(container.querySelectorAll('.option-select'))
                .map((group) => {
                    const parentCheckbox = group.querySelector('.multiOpcao-parent-checkbox');
                    const childCheckboxes = Array.from(group.querySelectorAll('.multiOpcao-child input[type="checkbox"]'));

                    return {
                        parentCheckbox,
                        childCheckboxes,
                        label: parentCheckbox?.dataset.label || parentCheckbox?.value || parentCheckbox?.parentElement?.textContent?.trim() || ''
                    };
                })
                .filter((group) => group.parentCheckbox && group.childCheckboxes.length > 0);

            const fullySelectedGroup = parentGroups.find((group) => group.childCheckboxes.length > 0 && group.childCheckboxes.every((checkbox) => checkbox.checked));

            if (selected.length === 0) {
                text.textContent = config.emptyText || 'Selecione';
            } else if (fullySelectedGroup && selected.length === fullySelectedGroup.childCheckboxes.length) {
                text.textContent = fullySelectedGroup.label;
            } else if (selected.length === 1) {
                text.textContent = selected[0];
            } else {
                text.textContent = config.multipleText
                    ? config.multipleText(selected.length)
                    : `${selected.length} selecionadas`;
            }
        }

        function toggleMenu() {
            const isOpen = options.classList.toggle('show');
            trigger.classList.toggle('opened', isOpen);
            trigger.setAttribute('aria-expanded', isOpen);
        }

        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMenu();
        });

        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener('change', () => {
                updateSelection();
            });
        });

        document.addEventListener('click', (event) => {
            if (!container.contains(event.target)) {
                options.classList.remove('show');
                trigger.classList.remove('opened');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        updateSelection();
    }

    window.initMultiselect = initMultiselect;
    window.initFranchiseMultiselect = initMultiselect;

    function initializeMultiselects() {
        document.querySelectorAll('.multiOpcao').forEach((container) => {
            initMultiselect(container);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMultiselects, { once: true });
    } else {
        initializeMultiselects();
    }
})();
