const songs = document.querySelectorAll('.song');
const modal = document.querySelector('#song-modal');
const modalCover = modal.querySelector('.song-modal__cover');
const modalTitle = modal.querySelector('#modal-song-title');
const modalMvLinks = {
    '3d': modal.querySelector('#modal-song-link-3d'),
    '2d': modal.querySelector('#modal-song-link-2d'),
    og: modal.querySelector('#modal-song-link-og')
};
const songList = document.querySelector('#all-songs');
const changeListButton = document.querySelector('#change-list');
const changeListIcon = changeListButton?.querySelector('.change-list__icon');
const changeListLabel = changeListButton?.querySelector('.change-list__style');
const viewStorageKey = 'project-sekai-focus-view';
const songStorageKey = 'project-sekai-focus-song';
const pageMain = document.querySelector('main');

let modalCharacterClass;

function ensureSongAudio(song) {
    if (song.querySelector('audio')) {
        return;
    }

    const cover = song.querySelector('img');
    const audioSource = cover?.getAttribute('src')?.replace(/_Game_Cover\.webp$/i, '_Preview.mp3');
    if (!audioSource) {
        return;
    }

    const audio = document.createElement('audio');
    const source = document.createElement('source');

    source.src = audioSource;
    source.type = 'audio/mpeg';
    audio.loop = true;
    audio.append(source);
    song.append(audio);
}

songs.forEach(ensureSongAudio);

function updateModalMvLinks(song, isVisible = false) {
    Object.entries(modalMvLinks).forEach(([type, link]) => {
        if (!link) {
            return;
        }

        const href = song.dataset[type]?.trim() || '';
        link.href = href || '#';
        link.hidden = !isVisible || !href;
    });
}

window.showModalMvLinks = () => {
    const focusedSong = songList?.querySelector('.song.is-focused');
    if (focusedSong) {
        updateModalMvLinks(focusedSong, true);
    }
};

window.hideModalMvLinks = () => {
    const focusedSong = songList?.querySelector('.song.is-focused');
    if (focusedSong) {
        updateModalMvLinks(focusedSong);
    }
};

setTimeout(() => {
    pageMain?.classList.add('is-ready');
}, 1000);

const listIcon = `<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
const coverIcon = `<path d="M9.068 3.228a25 25 0 0 0-4.136 0A2 2 0 0 0 3.242 4.9a25 25 0 0 0 0 4.2 2 2 0 0 0 1.69 1.67 25 25 0 0 0 4.136 0 2 2 0 0 0 1.69-1.67 25 25 0 0 0 0-4.2 2 2 0 0 0-1.69-1.672ZM19.068 3.228a25 25 0 0 0-4.136 0 2 2 0 0 0-1.69 1.672 25 25 0 0 0 0 4.2 2 2 0 0 0 1.69 1.67 25 25 0 0 0 4.136 0 2 2 0 0 0 1.69-1.67 25 25 0 0 0 0-4.2 2 2 0 0 0-1.69-1.672ZM9.068 13.228a25 25 0 0 0-4.136 0 2 2 0 0 0-1.69 1.672 25 25 0 0 0 0 4.2 2 2 0 0 0 1.69 1.67 25 25 0 0 0 4.136 0 2 2 0 0 0 1.69-1.67 25 25 0 0 0 0-4.2 2 2 0 0 0-1.69-1.672ZM19.068 13.228a25 25 0 0 0-4.136 0 2 2 0 0 0-1.69 1.672 25 25 0 0 0 0 4.2 2 2 0 0 0 1.69 1.67 25 25 0 0 0 4.136 0 2 2 0 0 0 1.69-1.67 25 25 0 0 0 0-4.2 2 2 0 0 0-1.69-1.672Z" fill="currentColor"/>`;

function updateListViewButton(isCoverView) {
    if (!changeListButton || !changeListIcon || !changeListLabel) {
        return;
    }

    const nextView = isCoverView ? 'lista' : 'capas';
    changeListIcon.innerHTML = isCoverView ? listIcon : coverIcon;
    changeListLabel.textContent = isCoverView ? 'Lista' : 'Capas';
    changeListButton.setAttribute('aria-label', `Mudar para visualização em ${nextView}`);
    changeListButton.title = `Mudar para visualização em ${nextView}`;
}

function scrollFocusedSong(focusedSong = songList?.querySelector('.song.is-focused')) {
    if (!focusedSong || focusedSong.hidden || !focusedSong.isConnected) {
        return;
    }

    const pageCenter = window.innerHeight / 2;
    const songCenter = focusedSong.getBoundingClientRect().top + focusedSong.offsetHeight / 2;
    const targetScrollTop = window.scrollY + songCenter - pageCenter;

    window.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'auto'
    });
}

window.addEventListener('songs-reordered', () => {
    const focusedSong = songList?.querySelector('.song.is-focused');
    const scroll = () => {
        if (!focusedSong || focusedSong.hidden || !focusedSong.isConnected) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            return;
        }
        scrollFocusedSong(focusedSong);
    };

    requestAnimationFrame(() => {
        requestAnimationFrame(scroll);
    });
});

function setListView(isCoverView, persist = false) {
    if (!songList) {
        return;
    }

    const focusedSong = songList.querySelector('.song.is-focused');
    songList.classList.toggle('cover-view', isCoverView);
    songList.classList.toggle('list-view', !isCoverView);
    updateListViewButton(isCoverView);

    if (persist) {
        localStorage.setItem(viewStorageKey, isCoverView ? 'covers' : 'list');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                scrollFocusedSong(focusedSong);
                setTimeout(() => scrollFocusedSong(focusedSong), 250);
            });
        });
    }
}

const savedView = localStorage.getItem(viewStorageKey);
setListView(savedView === 'covers');

changeListButton?.addEventListener('click', () => {
    setListView(!songList?.classList.contains('cover-view'), true);
});

songs.forEach(song => {
    const unit = song.dataset.unit || '';
    const info = document.createElement('div');
    const title = document.createElement('strong');
    const unitLabel = document.createElement('span');
    const mvIcons = document.createElement('div');

    info.className = 'song-info';
    mvIcons.className = 'song-mv-icons';
    title.textContent = song.dataset.tooltip || '';
    unitLabel.textContent = unit;
    info.append(title, unitLabel);

    [
        ['3d', '3D'],
        ['2d', '2D'],
        ['og', 'OG']
    ].forEach(([type, label]) => {
        if (!song.dataset[type]?.trim()) {
            return;
        }

        const icon = document.createElement('span');
        icon.className = `song-mv-icon song-mv-icon--${type}`;
        icon.textContent = label;
        icon.title = `${label === 'OG' ? 'Original' : label} MV disponível`;
        icon.setAttribute('aria-label', `${label === 'OG' ? 'Original' : label} MV disponível`);
        mvIcons.append(icon);
    });

    song.append(info, mvIcons);
});

function getCharacterClass(song) {
    const characterName = song.dataset.character || song.dataset.characterClass;

    return characterName?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function openModal(song) {
    const image = song.querySelector('img');
    const title = song.dataset.tooltip || image.alt;
    const gameCoverSource = image.src.replace(/_Card\.webp$/i, '_Game_Cover.webp');
    const characterClass = getCharacterClass(song);

    if (modalCharacterClass) {
        modal.classList.remove(modalCharacterClass);
    }
    if (characterClass) {
        modal.classList.add(characterClass);
        modalCharacterClass = characterClass;
    }
    modalCover.src = gameCoverSource;
    modalCover.alt = `${title} - Game Cover`;
    modalCover.parentElement.style.setProperty('--modal-cover-image', `url("${gameCoverSource}")`);
    updateModalMvLinks(song);
    window.updateSongInfoPanel?.(song);
    modalTitle.textContent = title;
    updateSongDescription(song);
    modal.hidden = false;
    document.body.classList.add('modal-open');
}

function getSongStorageId(song) {
    return `${song.dataset.tooltip || ''}::${song.dataset.release || ''}`;
}

const audioFadeDuration = 180;

function fadeAudio(audio, targetVolume, transitionId, onComplete) {
    clearTimeout(audio.fadeTimer);

    const initialVolume = audio.volume;
    const startedAt = performance.now();

    const animate = (currentTime) => {
        if (audio.transitionId !== transitionId) {
            return;
        }

        const progress = Math.min((currentTime - startedAt) / audioFadeDuration, 1);
        audio.volume = initialVolume + (targetVolume - initialVolume) * progress;

        if (progress < 1) {
            audio.fadeTimer = setTimeout(() => animate(performance.now()), 16);
            return;
        }

        onComplete?.();
    };

    audio.fadeTimer = setTimeout(() => animate(performance.now()), 16);
}

function syncFocusedSongAudio(focusedSong) {
    songs.forEach((song) => {
        const audio = song.querySelector('audio');
        if (!audio) {
            return;
        }

        audio.loop = true;

        if (song !== focusedSong) {
            const transitionId = (audio.transitionId || 0) + 1;
            audio.transitionId = transitionId;
            clearTimeout(audio.fadeTimer);

            if (audio.paused || audio.readyState === 0) {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 1;
                return;
            }

            fadeAudio(audio, 0, transitionId, () => {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 1;
            });
        }
    });

    const focusedAudio = focusedSong.querySelector('audio');
    if (!focusedAudio) {
        return;
    }

    const transitionId = (focusedAudio.transitionId || 0) + 1;
    focusedAudio.transitionId = transitionId;
    clearTimeout(focusedAudio.fadeTimer);
    focusedAudio.currentTime = 0;
    focusedAudio.volume = 0;
    fadeAudio(focusedAudio, 1, transitionId);
    void focusedAudio.play()
        .then(() => {
            if (focusedAudio.transitionId !== transitionId || !focusedSong.classList.contains('is-focused')) {
                focusedAudio.pause();
                focusedAudio.currentTime = 0;
                focusedAudio.volume = 1;
                return;
            }
        })
        .catch(() => {
            if (focusedAudio.transitionId === transitionId) {
                clearTimeout(focusedAudio.fadeTimer);
                focusedAudio.volume = 1;
            }
        });
}

function focusSong(song, shouldScroll = false) {
    if (!song) {
        return;
    }

    songs.forEach((otherSong) => otherSong.classList.remove('is-focused'));
    song.classList.add('is-focused');
    syncFocusedSongAudio(song);
    localStorage.setItem(songStorageKey, getSongStorageId(song));
    openModal(song);

    if (shouldScroll) {
        scrollFocusedSong();
    }
}

songs.forEach((song) => {
    song.dataset.characterClass = getCharacterClass(song);
    song.tabIndex = 0;
    song.setAttribute('role', 'button');
    song.setAttribute('aria-label', `Abrir detalhes de ${song.dataset.tooltip}`);

    song.addEventListener('click', () => {
        focusSong(song);
    });
    song.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            focusSong(song);
        }
    });
});

if (songs.length > 0) {
    const savedSongId = localStorage.getItem(songStorageKey);
    const savedSong = Array.from(songs).find((song) => getSongStorageId(song) === savedSongId);
    const activateSavedSong = () => focusSong(savedSong || songs[0], true);
    const activateAfterPageReady = () => setTimeout(activateSavedSong, 1000);

    if (document.readyState === 'complete') {
        activateAfterPageReady();
    } else {
        window.addEventListener('load', activateAfterPageReady, { once: true });
    }
}

const protectedImages = document.querySelectorAll('img');
protectedImages.forEach((image) => {
    image.draggable = false;
    image.setAttribute('draggable', 'false');
    image.setAttribute('oncontextmenu', 'return false;');
    image.addEventListener('dragstart', (event) => event.preventDefault());
    image.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            event.preventDefault();
        }
    });
});

document.addEventListener('contextmenu', (event) => {
    if (event.target.closest('img')) {
        event.preventDefault();
    }
});

document.addEventListener('dragstart', (event) => {
    if (event.target.closest('img')) {
        event.preventDefault();
    }
});

