(function () {
    function initParentChild(container = document) {
        container.querySelectorAll('.multiOpcao-parent-header').forEach((parentHeader) => {
            const parentCheckbox = parentHeader.querySelector('.multiOpcao-parent-checkbox');
            const expandButton = parentHeader.querySelector('.expand-button');
            const subOpcoes = parentHeader.nextElementSibling;
            const childCheckboxes = subOpcoes?.querySelectorAll(".multiOpcao-child input[type='checkbox']") || [];

            if (!parentCheckbox || childCheckboxes.length === 0) {
                return;
            }

            function syncParentCheckbox() {
                const checkedChildren = Array.from(childCheckboxes).filter((checkbox) => checkbox.checked).length;
                const allChecked = checkedChildren === childCheckboxes.length;
                const someChecked = checkedChildren > 0 && !allChecked;

                parentCheckbox.checked = allChecked;
                parentCheckbox.indeterminate = someChecked;
            }

            if (expandButton && subOpcoes) {
                expandButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    subOpcoes.classList.toggle('expanded');
                    expandButton.classList.toggle('expanded');
                });
            }

            parentCheckbox.addEventListener('change', () => {
                const checkedChildren = Array.from(childCheckboxes).filter((checkbox) => checkbox.checked).length;
                const isPartialSelection = checkedChildren > 0 && checkedChildren < childCheckboxes.length;
                const shouldCheck = isPartialSelection || parentCheckbox.checked;

                childCheckboxes.forEach((checkbox) => {
                    checkbox.checked = shouldCheck;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                });
                syncParentCheckbox();
            });

            childCheckboxes.forEach((checkbox) => {
                checkbox.addEventListener('change', syncParentCheckbox);
            });

            syncParentCheckbox();
        });
    }

    window.initParentChild = initParentChild;
    window.initFranchiseParentChild = initParentChild;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initParentChild(), { once: true });
    } else {
        initParentChild();
    }
})();
