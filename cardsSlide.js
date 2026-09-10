// Controla o slide de cards
const songInfoSection = document.querySelector('.song-info-section');
const songInfoModal = document.querySelector('#song-modal');
const selectSongButton = document.querySelector('#modal-song-select-button');
const songInfoBackButton = document.querySelector('.song-info-panel__back-button');
const songInfoEventLogo = document.querySelector('.song-info-panel__event-logo');
const songInfoEventLogoImage = songInfoEventLogo?.querySelector('img');
const songInfoTabs = Array.from(document.querySelectorAll('.song-info-panel__tab'));
const songInfoCardTitle = document.querySelector('.song-info-panel__card-title');
const songInfoCharacterName = document.querySelector('.song-info-panel__char-name');
const songInfoCardImage = document.querySelector('.song-info-panel__card-img');
const songInfoUntrained = document.querySelector('.song-info-panel__untrained');
const songInfoUntrainedInput = songInfoUntrained?.querySelector('input');
const songInfoHead = document.querySelector('.song-info-panel__head');
const previousCardButton = document.querySelector('.song-info-panel__card-nav--previous');
const nextCardButton = document.querySelector('.song-info-panel__card-nav--next');
const songInfoStars = document.createElement('div');

songInfoStars.className = 'song-info-panel__stars';
songInfoCardImage?.parentElement.append(songInfoStars);

let selectedSongCards = [];

const unitClasses = {
    'leo/need': 'leo-need',
    'more more jump!': 'more-more-jump',
    'vivid bad squad': 'vivid-bad-squad',
    'wonderlands x showtime': 'wonderlands-x-showtime',
    '25ji, nightcord de.': '25ji-nightcord-de'
};

function getCardForSlot(slot) {
    return selectedSongCards.find((card) => card.dataset.cardSlot === String(slot));
}

function updateCardStars(card) {
    songInfoStars.replaceChildren();

    if (!card) {
        return;
    }

    const rarity = Number(card.dataset.cardRarity) || 0;
    const starType = rarity === 2 || songInfoUntrainedInput?.checked ? 'untrained' : 'trained';

    for (let index = 0; index < rarity; index += 1) {
        const star = document.createElement('img');
        star.src = `imagens/rarity/Star_${starType}.webp`;
        star.alt = '';
        star.setAttribute('aria-hidden', 'true');
        songInfoStars.append(star);
    }
}

function updateSelectedCard(slot) {
    const card = getCardForSlot(slot);
    const hasUntrained = Boolean(card?.dataset.cardUntrained);

    songInfoTabs.forEach((tab) => {
        const isActive = tab.dataset.cardSlot === String(slot);
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.disabled = isActive;
    });

    if (!card) {
        songInfoCardTitle.textContent = '';
        songInfoCharacterName.textContent = '';
        songInfoCardImage.removeAttribute('src');
        songInfoCardImage.alt = '';
        songInfoStars.replaceChildren();
        return;
    }

    songInfoCardTitle.textContent = card.alt;
    songInfoCharacterName.textContent = card.dataset.cardChar || '';
    songInfoCardImage.src = songInfoUntrainedInput?.checked && hasUntrained
        ? card.dataset.cardUntrained
        : card.src;
    songInfoCardImage.alt = card.alt;
    updateCardStars(card);
}

function selectCardSlot(slot) {
    const card = getCardForSlot(slot);

    if (!card) {
        return;
    }

    if (songInfoUntrainedInput) {
        songInfoUntrainedInput.checked = false;
        songInfoUntrainedInput.disabled = !card.dataset.cardUntrained;
    }
    if (songInfoUntrained) {
        songInfoUntrained.hidden = slot === '5' || !card.dataset.cardUntrained;
    }
    updateSelectedCard(slot);
}

function moveToAdjacentCard(direction) {
    if (selectedSongCards.length === 0) {
        return;
    }

    const activeTab = songInfoTabs.find((tab) => tab.classList.contains('is-active'));
    const activeIndex = selectedSongCards.findIndex((card) => card.dataset.cardSlot === activeTab?.dataset.cardSlot);
    const nextIndex = (activeIndex + direction + selectedSongCards.length) % selectedSongCards.length;
    selectCardSlot(selectedSongCards[nextIndex].dataset.cardSlot);
}

function updateSongInfoPanel(song) {
    if (!song) {
        return;
    }

    const image = song.querySelector('img');
    const gameCoverSource = image?.src.replace(/_Card\.webp$/i, '_Game_Cover.webp');
    const eventLogoSource = gameCoverSource?.replace(/_Game_Cover\.webp$/i, '_Event_Logo.webp');
    const eventName = (song.dataset.event || '').replace(/\s*\([^)]*\)/g, '').trim();

    if (songInfoEventLogoImage) {
        songInfoEventLogoImage.src = eventLogoSource || '';
        songInfoEventLogoImage.alt = eventName;
    }
    songInfoEventLogo?.setAttribute('aria-label', eventName);

    selectedSongCards = Array.from(song.querySelectorAll('.event-cards img[data-card-slot]'));
    const unitKey = song.dataset.unit?.trim().toLowerCase();
    songInfoHead?.classList.remove(...Object.values(unitClasses).map((unitClass) => `unit-${unitClass}`));
    if (unitClasses[unitKey]) {
        songInfoHead?.classList.add(`unit-${unitClasses[unitKey]}`);
    }

    songInfoTabs.forEach((tab, index) => {
        const slot = String(index + 1);
        const hasCard = Boolean(getCardForSlot(slot));
        tab.dataset.cardSlot = slot;
        tab.hidden = !hasCard;
        tab.setAttribute('aria-selected', 'false');
        tab.disabled = false;
    });

    const firstCard = getCardForSlot('1') || selectedSongCards[0];
    const firstSlot = firstCard?.dataset.cardSlot;
    selectCardSlot(firstSlot || '');
}

window.updateSongInfoPanel = updateSongInfoPanel;

function openSongInfoSection() {
    if (!songInfoSection || !songInfoModal) {
        return;
    }

    window.showModalMvLinks?.();
    songInfoModal.hidden = true;
    document.body.classList.remove('modal-open');
    document.body.classList.add('info-panel-open');
    songInfoSection.hidden = false;
    songInfoSection.style.display = 'block';
}

function closeSongInfoSection() {
    if (!songInfoSection || !songInfoModal) {
        return;
    }

    window.hideModalMvLinks?.();
    document.body.classList.remove('info-panel-open');
    songInfoSection.hidden = true;
    songInfoSection.style.display = 'none';
    songInfoModal.hidden = false;
    document.body.classList.add('modal-open');

    const focusedSong = document.querySelector('.song.is-focused');
    focusedSong?.scrollIntoView({ block: 'center', behavior: 'auto' });
}

selectSongButton?.addEventListener('click', openSongInfoSection);
songInfoBackButton?.addEventListener('click', closeSongInfoSection);

songInfoTabs.forEach((tab, index) => {
    tab.dataset.cardSlot = String(index + 1);
    tab.addEventListener('click', () => {
        if (tab.disabled) {
            return;
        }
        selectCardSlot(tab.dataset.cardSlot);
    });
});

previousCardButton?.addEventListener('click', () => moveToAdjacentCard(1));
nextCardButton?.addEventListener('click', () => moveToAdjacentCard(-1));

songInfoUntrainedInput?.addEventListener('change', () => {
    const activeTab = songInfoTabs.find((tab) => tab.classList.contains('is-active'));
    updateSelectedCard(activeTab?.dataset.cardSlot || '');
});