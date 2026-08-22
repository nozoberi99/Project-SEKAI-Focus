export function agruparPorUnit(itens) {
    return agrupar(itens, (item) => item.unit || 'Sem unit');
}

function agrupar(itens, getKey) {
    const grupos = new Map();
    itens.forEach((item) => {
        const chave = getKey(item);
        if (!grupos.has(chave)) grupos.set(chave, []);
        grupos.get(chave).push(item);
    });
    return grupos;
}
