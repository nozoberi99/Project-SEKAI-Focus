export function agruparPorRoll(itens) {
    const grupos = new Map();
    itens.forEach((item) => {
        const chave = item.roll || 'Sem roll';
        if (!grupos.has(chave)) grupos.set(chave, []);
        grupos.get(chave).push(item);
    });
    return new Map([...grupos].sort(([a], [b]) => Number(a) - Number(b)));
}
