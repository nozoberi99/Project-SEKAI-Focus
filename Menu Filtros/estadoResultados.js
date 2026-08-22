import { replayEntranceAnimations } from './animacoesEntrada.js';

const resultMessage = document.getElementById('mensagem-nenhum-resultado');
const groups = Array.from(document.querySelectorAll('.character-focus'));

function getSelectedSectionIds() {
    return Array.from(document.querySelectorAll('.multiOpcao-child input[type="checkbox"], .multiOpcao-parent-checkbox'))
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.dataset.sectionId || checkbox.dataset.sectionClass || checkbox.value)
        .filter(Boolean);
}

function isSectionAllowedByFranchise(group) {
    const selectedSectionIds = getSelectedSectionIds();
    if (selectedSectionIds.length === 0) {
        return true;
    }

    return selectedSectionIds.some((sectionId) => group?.classList.contains(sectionId));
}

function isVisibleCard(card) {
    const group = card.closest('.character-focus');
    const groupIsHidden = group && (group.hidden || group.style.display === 'none');
    const matchesFranchise = card.dataset.franchiseMatch !== 'false';

    return !card.hidden && card.style.display !== 'none' && !groupIsHidden && matchesFranchise;
}

export function updateResultsState() {
    const resultCards = Array.from(document.querySelectorAll('.song'));
    const visibleCards = resultCards.filter(isVisibleCard);

    groups.forEach((group) => {
        const shouldShowByFranchise = isSectionAllowedByFranchise(group);
        const hasVisibleCard = Array.from(group.querySelectorAll('.song')).some(isVisibleCard);
        group.hidden = !shouldShowByFranchise || !hasVisibleCard;
        group.style.display = group.hidden ? 'none' : '';
    });

    if (resultMessage) {
        resultMessage.hidden = visibleCards.length > 0;
    }

    replayEntranceAnimations();
}
