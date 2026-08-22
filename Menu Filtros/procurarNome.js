const inputNome = document.getElementById('name-input');
const grupos = document.querySelectorAll('.character-focus, .groups');

function normalizarTexto(texto) {
    return texto.trim().toLowerCase();
}

export function atualizarVisibilidadeMusicas() {
    document.querySelectorAll('.song').forEach((musica) => {
        const filtros = [
            musica.dataset.nameMatch,
            musica.dataset.rollMatch,
            musica.dataset.vsingMatch,
            musica.dataset.eventMatch,
            musica.dataset.mvMatch,
            musica.dataset.franchiseMatch
        ];
        musica.hidden = filtros.includes('false');
    });
}

export function filtrarPersonagens() {
    const termoPesquisa = normalizarTexto(inputNome?.value || '');

    document.querySelectorAll('.song').forEach((musica) => {
        const grupo = musica.closest('.character-focus');
        const nomePersonagem = normalizarTexto(grupo?.querySelector('.character-name')?.textContent || '');
        const camposPesquisa = [
            musica.dataset.tooltip,
            musica.dataset.event,
            musica.dataset.prod,
            nomePersonagem
        ].map((campo) => normalizarTexto(campo || ''));
        musica.dataset.nameMatch = String(termoPesquisa === '' || camposPesquisa.some((campo) => campo.includes(termoPesquisa)));
    });

    grupos.forEach((grupo) => {
        const nomePersonagem = normalizarTexto(grupo.querySelector('.character-name')?.textContent || '');
        const musicas = grupo.querySelectorAll('.song');
        let grupoTemResultado = musicas.length === 0 && nomePersonagem.includes(termoPesquisa);

        musicas.forEach((musica) => {
            const deveMostrar = musica.dataset.nameMatch === 'true';
            if (deveMostrar) {
                grupoTemResultado = true;
            }
        });

        grupo.hidden = termoPesquisa !== '' && !grupoTemResultado;
    });

    atualizarVisibilidadeMusicas();
}