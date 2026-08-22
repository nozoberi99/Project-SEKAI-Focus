// Menu geral de filtros da página de personagens.

function toggleMenuIcon(x) {
    x?.classList.toggle("change");
}

function closeDropdown() {
    const dropdown = document.getElementById("filters-dropdown");
    const overlay = document.getElementById("filter-overlay");
    const button = document.getElementById("filter-button");

    dropdown?.classList.remove("show");
    overlay?.classList.remove("show");
    button?.classList.remove("change");
}

function toggleDropdown() {
    const dropdown = document.getElementById("filters-dropdown");
    const overlay = document.getElementById("filter-overlay");
    const shouldOpen = !dropdown?.classList.contains("show");

    dropdown?.classList.toggle("show", shouldOpen);
    overlay?.classList.toggle("show", shouldOpen);
}

document.getElementById("filter-overlay")?.addEventListener("click", closeDropdown);
document.getElementById("search-button")?.addEventListener("click", closeDropdown);

const moreOptionsButton = document.getElementById("more-options-button");
const moreOptionsPanel = document.getElementById("more-options-panel");

if (moreOptionsButton && moreOptionsPanel) {
    moreOptionsButton.addEventListener("click", () => {
        const isExpanded = moreOptionsButton.getAttribute("aria-expanded") === "true";
        moreOptionsButton.setAttribute("aria-expanded", String(!isExpanded));
        moreOptionsPanel.hidden = isExpanded;
    });
}