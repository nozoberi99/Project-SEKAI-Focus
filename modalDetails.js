const songDetailAttributes = ['kanji', 'ptbr', 'prod', 'vs', 'release'];
const songVideoTypes = [
  { type: '2d', frame: 'vid1' },
  { type: '3d', frame: 'vid2' },
  { type: 'og', frame: 'vid3' },
];

const ordinalNumbers = [
  'primeira', 'segunda', 'terceira', 'quarta', 'quinta', 'sexta', 'sétima', 'oitava', 'nona', 'décima',
];

function getOrdinal(number) {
  const numericValue = Number.parseInt(number, 10);
  if (!numericValue) {
    return '';
  }

  return ordinalNumbers[numericValue - 1] || `${numericValue}ª`;
}

function updateSongDetails(song) {
  const rows = document.querySelectorAll('.song-modal__infoline');

  rows.forEach((row, index) => {
    const value = song.dataset[songDetailAttributes[index]]?.trim() || '';
    const cell = row.querySelector('.song-modal__infodata');

    cell.textContent = value;
    row.hidden = value === '';
  });
}

function updateSongDescription(song) {
  const characterHeading = song.closest('.character-focus')?.querySelector('.character-name');
  const comment = song.querySelector('#comment')?.textContent.trim() || '';
  const commentElement = document.querySelector('.song-modal__comment');
  const authorElement = document.querySelector('.song-modal__author');
  const data = song.dataset;
  const kanji = data.kanji?.trim() || '';
  const portuguese = data.ptbr?.trim() || '';
  const languageElement = document.getElementById('modal-song-description-lang');
  const commaElement = document.getElementById('modal-song-description-comma');

  if (commentElement) {
    commentElement.hidden = !comment;
  }
  if (authorElement) {
    authorElement.hidden = !comment;
  }
  if (languageElement) {
    languageElement.hidden = !kanji && !portuguese;
  }
  if (commaElement) {
    commaElement.hidden = !kanji || !portuguese;
  }

  const values = {
    'modal-song-comment': comment,
    'modal-song-producer': data.prod || '',
    'modal-song-description-title': data.tooltip || '',
    'modal-song-description-kanji': kanji,
    'modal-song-description-ptbr': portuguese,
    'modal-song-description-producer': data.prod || '',
    'modal-song-description-roll': getOrdinal(data.roll),
    'modal-song-description-character': characterHeading?.textContent.trim() || '',
    'modal-song-description-event': data.event || '',
    'modal-song-description-release': data.release || '',
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });
}

function getVideoSource(song, type) {
  const dataElement = song.querySelector(`data-${type}`);
  const source = dataElement?.getAttribute(`data-${type}`)?.trim() || song.dataset[type] || '';

  if (!source) {
    return '';
  }

  try {
    const url = new URL(source);
    let videoId = url.hostname === 'youtu.be'
      ? url.pathname.slice(1)
      : url.searchParams.get('v');

    if (!videoId && url.pathname.includes('/embed/')) {
      videoId = url.pathname.split('/embed/')[1];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : source;
  } catch {
    return source;
  }
}

function updateSongVideos(song) {
  const videoSection = document.querySelector('.song-modal__videos');
  const availableVideos = [];

  songVideoTypes.forEach(({ type, frame }) => {
    const source = getVideoSource(song, type);
    const button = document.querySelector(`[data-video-type="${type}"]`);
    const iframe = document.getElementById(frame);

    button.hidden = !source;
    iframe.hidden = !source;
    iframe.src = source;

    if (source) {
      availableVideos.push({ button, frame });
    }
  });

  videoSection.hidden = availableVideos.length === 0;
  if (availableVideos.length > 0) {
    availableVideos[0].button.click();
  }
}

function showvideo(evt, infoName) {
  const videos = document.getElementsByClassName('video');
  for (let index = 0; index < videos.length; index++) {
    videos[index].classList.remove('active');
  }

  const videoButtons = document.getElementsByClassName('seevideo');
  for (let index = 0; index < videoButtons.length; index++) {
    videoButtons[index].classList.remove('active');
  }

  const selectedVideo = document.getElementById(infoName);
  if (selectedVideo) {
    selectedVideo.classList.add("active");
  }

  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add("active");
  }
}

function initVideoButtons() {
  document.querySelectorAll('.seevideo').forEach((button) => {
    button.addEventListener('click', (event) => showvideo(event, button.dataset.videoFrame));
  });
}

function initVideoTabs() {
  const defaultOpen = document.getElementById('defaultOpenvideo');
  if (defaultOpen) {
    defaultOpen.click();
  }
}

if (document.readyState === "loading") {
  document.addEventListener('DOMContentLoaded', () => {
    initVideoButtons();
    initVideoTabs();
  });
} else {
  initVideoButtons();
  initVideoTabs();
}