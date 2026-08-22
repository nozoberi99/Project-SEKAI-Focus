export function ordenarPorNome(itens) {
    return itens.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}
