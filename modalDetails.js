const ordinalNumbers = [
  'primeira', 'segunda', 'terceira', 'quarta', 'quinta', 'sexta', 'sétima', 'oitava', 'nona', 'décima',
];

const monthNames = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

function getOrdinal(number) {
  const numericValue = Number.parseInt(number, 10);
  if (!numericValue) {
    return '';
  }

  return ordinalNumbers[numericValue - 1] || `${numericValue}ª`;
}

function formatReleaseDate(date) {
  const match = date.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    return date;
  }

  const [, day, month, year] = match;
  return `${day} de ${monthNames[Number(month) - 1] || month} de ${year}`;
}

function updateSongDescription(song) {
  const characterHeading = document.getElementById(song.dataset.character);
  const comments = Array.from(song.querySelectorAll('#comment'))
    .map((element) => element.textContent.trim());
  const authors = Array.from(song.querySelectorAll('.author'))
    .map((element) => element.textContent.trim());
  const commentsContainer = document.getElementById('modal-song-comments');
  const data = song.dataset;
  const kanji = data.kanji?.trim() || '';
  const portuguese = data.ptbr?.trim() || '';
  const languageElement = document.getElementById('modal-song-description-lang');
  const commaElement = document.getElementById('modal-song-description-comma');

  if (commentsContainer) {
    commentsContainer.replaceChildren();

    comments.forEach((comment, index) => {
      if (!comment) {
        return;
      }

      const commentElement = document.createElement('p');
      commentElement.className = 'song-modal__comment';
      commentElement.textContent = `"${comment}"`;
      commentsContainer.append(commentElement);

      const author = authors[index];
      if (author) {
        const authorElement = document.createElement('p');
        authorElement.className = 'song-modal__author';
        authorElement.textContent = author;
        commentsContainer.append(authorElement);
      }
    });
  }
  if (languageElement) {
    languageElement.hidden = !kanji && !portuguese;
  }
  if (commaElement) {
    commaElement.hidden = !kanji || !portuguese;
  }

  const values = {
    'modal-song-description-title': data.tooltip || '',
    'modal-song-description-unit': data.unit || '',
    'modal-song-description-vs': data.vs || '',
    'modal-song-description-kanji': kanji,
    'modal-song-description-ptbr': portuguese,
    'modal-song-description-producer': data.prod || '',
    'modal-song-description-roll': getOrdinal(data.roll),
    'modal-song-description-character': characterHeading?.textContent.trim() || '',
    'modal-song-description-event': data.event || '',
    'modal-song-description-release': formatReleaseDate(data.release?.trim() || ''),
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  });
}
