const resultMessage = document.getElementById('mensagem-nenhum-resultado');
function isVisibleCard(card) {
    const matchesFranchise = card.dataset.franchiseMatch !== 'false';

    return !card.hidden && card.style.display !== 'none' && matchesFranchise;
}

export function updateResultsState() {
    const resultCards = Array.from(document.querySelectorAll('.song'));
    const visibleCards = resultCards.filter(isVisibleCard);

    if (resultMessage) {
        resultMessage.hidden = visibleCards.length > 0;
    }

    window.dispatchEvent(new CustomEvent('filters-updated'));
}
