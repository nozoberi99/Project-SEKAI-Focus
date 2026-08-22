export function ordenarPorPersonagem(itens) {
    return itens.slice().sort((a, b) => a.personagem.localeCompare(b.personagem, 'pt-BR'));
}
