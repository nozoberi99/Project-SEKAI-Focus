import { atualizarVisibilidadeMusicas } from './procurarNome.js';

const eventOptions = Array.from(document.querySelectorAll('.event-selection'));
let selectedEvent = '';

function updateEventSelection() {
    eventOptions.forEach((option) => {
        const isSelected = option.dataset.value === selectedEvent;
        option.classList.toggle('selected', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
    });

    const noSelection = document.getElementById('event-no-select');
    const isEmpty = selectedEvent === '';
    noSelection?.classList.toggle('selected', isEmpty);
    noSelection?.setAttribute('aria-selected', String(isEmpty));
}

export function applyEventFilter() {
    document.querySelectorAll('.song').forEach((song) => {
        const matches = selectedEvent === '' || song.dataset.eventType === selectedEvent;
        song.dataset.eventMatch = String(matches);
    });
    atualizarVisibilidadeMusicas();
}

export function resetEventFilter() {
    selectedEvent = '';
    updateEventSelection();
    document.querySelectorAll('.song').forEach((song) => {
        delete song.dataset.eventMatch;
    });
}

eventOptions.forEach((option) => {
    option.addEventListener('click', () => {
        selectedEvent = option.id === 'event-no-select' ? '' : option.dataset.value || '';
        updateEventSelection();
    });
});

updateEventSelection();
