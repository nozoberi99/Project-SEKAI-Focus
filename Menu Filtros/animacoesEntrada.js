const entranceTargets = 'h1, ul, ol, .song';
const listStartDelay = 500;
const itemDelay = 80;

export function replayEntranceAnimations() {
    const pageElements = Array.from(document.querySelectorAll(entranceTargets))
        .filter((element) => !element.closest('.song-modal'));

    pageElements.forEach((element) => {
        element.classList.remove('results-enter');
        element.style.removeProperty('--entrance-delay');
    });

    const visibleElements = pageElements.filter((element) => !element.hidden && element.style.display !== 'none');

    let songIndex = 0;

    visibleElements.forEach((element) => {
        void element.offsetWidth;
        const delay = element.matches('ul, ol')
            ? listStartDelay
            : element.matches('.song')
                ? listStartDelay + ((songIndex++) * itemDelay)
                : 0;
        element.style.setProperty('--entrance-delay', `${delay}ms`);
        element.classList.add('results-enter');
    });
}

replayEntranceAnimations();