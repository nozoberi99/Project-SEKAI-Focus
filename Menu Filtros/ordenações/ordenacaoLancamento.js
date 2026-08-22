export function agruparPorLancamento(itens) {
    const grupos = new Map();
    itens.forEach((item) => {
        const chave = item.lancamento.slice(-4) || 'Sem ano';
        if (!grupos.has(chave)) grupos.set(chave, []);
        grupos.get(chave).push(item);
    });
    return new Map([...grupos].sort(([a], [b]) => Number(a) - Number(b)));
}
