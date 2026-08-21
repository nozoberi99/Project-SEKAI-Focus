const songs = document.querySelectorAll('.song');
const modal = document.querySelector('#song-modal');
const modalImage = modal.querySelector('.song-modal__image');
const modalCover = modal.querySelector('.song-modal__cover');
const modalEvent = modal.querySelector('.song-modal__event');
const modalTitle = modal.querySelector('#modal-song-title');
const closeButtons = modal.querySelectorAll('[data-modal-close]');

let lastFocusedSong;
let modalCharacterClass;

function getCharacterClass(song) {
    const characterFocus = song.closest('.character-focus');
    const heading = characterFocus?.querySelector('.character-name');
    const characterName = characterFocus?.id || heading?.textContent.trim();

    return characterName?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function openModal(song) {
    const image = song.querySelector('img');
    const title = song.dataset.tooltip || image.alt;
    const gameCoverSource = image.src.replace(/_Card\.webp$/i, '_Game_Cover.webp');
    const eventSource = image.src.replace(/_Card\.webp$/i, '_Event_Logo.webp');
    const characterClass = getCharacterClass(song);

    lastFocusedSong = song;
    if (modalCharacterClass) {
        modal.classList.remove(modalCharacterClass);
    }
    if (characterClass) {
        modal.classList.add(characterClass);
        modalCharacterClass = characterClass;
    }
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalCover.src = gameCoverSource;
    modalCover.alt = `${title} - Game Cover`;
    modalEvent.src = eventSource;
    modalEvent.alt = `${title} - Event Logo`;
    modalTitle.textContent = title;
    updateSongDetails(song);
    updateSongDescription(song);
    updateSongVideos(song);
    modal.hidden = false;
    document.body.classList.add('modal-open');
    modal.querySelector('.song-modal__close').focus();
}

function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    modalImage.src = '';
    modalCover.src = '';
    modalEvent.src = '';
    lastFocusedSong?.focus();
}

songs.forEach((song) => {
    song.tabIndex = 0;
    song.setAttribute('role', 'button');
    song.setAttribute('aria-label', `Abrir detalhes de ${song.dataset.tooltip}`);

    song.addEventListener('click', () => openModal(song));
    song.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openModal(song);
        }
    });
});

closeButtons.forEach((button) => button.addEventListener('click', closeModal));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
        closeModal();
    }
});
