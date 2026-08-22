export function agruparPorVirtualSinger(itens) {
    const grupos = new Map();
    itens.forEach((item) => {
        const chave = item.virtualSinger || 'Sem Virtual Singer';
        if (!grupos.has(chave)) grupos.set(chave, []);
        grupos.get(chave).push(item);
    });
    return grupos;
}
