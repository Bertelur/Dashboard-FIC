function formatIDR(value: number): string {
    try {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `Rp ${value}`;
    }
}

export { formatIDR };