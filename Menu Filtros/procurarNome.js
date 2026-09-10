const inputNome = document.getElementById('name-input');
function normalizarTexto(texto) {
    return texto.trim().toLowerCase();
}

export function atualizarVisibilidadeMusicas() {
    document.querySelectorAll('.song').forEach((musica) => {
        const filtros = [
            musica.dataset.nameMatch,
            musica.dataset.rollMatch,
            musica.dataset.vsingMatch,
            musica.dataset.characterMatch,
            musica.dataset.eventMatch,
            musica.dataset.mvMatch,
            musica.dataset.unitMatch,
            musica.dataset.franchiseMatch
        ];
        musica.hidden = filtros.includes('false');
    });
}

export function filtrarPersonagens() {
    const termoPesquisa = normalizarTexto(inputNome?.value || '');

    document.querySelectorAll('.song').forEach((musica) => {
        const camposPesquisa = [
            musica.dataset.tooltip,
            musica.dataset.prod
        ].map((campo) => normalizarTexto(campo || ''));
        musica.dataset.nameMatch = String(termoPesquisa === '' || camposPesquisa.some((campo) => campo.includes(termoPesquisa)));
    });

    atualizarVisibilidadeMusicas();
}