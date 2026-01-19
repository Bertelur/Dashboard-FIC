export function formatNumber(v: number) {
    return new Intl.NumberFormat("id-ID").format(v);
}
