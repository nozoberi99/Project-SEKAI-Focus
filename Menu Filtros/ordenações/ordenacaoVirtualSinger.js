export function agruparPorVirtualSinger(itens) {
    const ordem = [
        'Hatsune Miku',
        'Kagamine Rin',
        'Kagamine Len',
        'Megurine Luka',
        'MEIKO',
        'KAITO'
    ];
    const grupos = new Map(ordem.map((chave) => [chave, []]));
    itens.forEach((item) => {
        if (grupos.has(item.virtualSinger)) grupos.get(item.virtualSinger).push(item);
    });
    [...grupos].forEach(([chave, grupo]) => {
        if (!grupo.length) grupos.delete(chave);
    });
    return grupos;
}
