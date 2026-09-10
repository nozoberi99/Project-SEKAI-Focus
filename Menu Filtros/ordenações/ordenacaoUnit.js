const ordemUnidades = [
    'leo/need',
    'more more jump!',
    'vivid bad squad',
    'wonderlands x showtime',
    '25ji, nightcord de.'
];

function normalizarUnit(valor = '') {
    return String(valor).trim().toLowerCase();
}

function indiceDaUnit(chave) {
    const index = ordemUnidades.indexOf(normalizarUnit(chave));
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export function agruparPorUnit(itens) {
    const grupos = agrupar(itens, (item) => item.unit || 'Sem unit');

    return new Map(
        [...grupos.entries()].sort(([a], [b]) => {
            const indiceA = indiceDaUnit(a);
            const indiceB = indiceDaUnit(b);

            if (indiceA !== indiceB) {
                return indiceA - indiceB;
            }

            return a.localeCompare(b);
        })
    );
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
