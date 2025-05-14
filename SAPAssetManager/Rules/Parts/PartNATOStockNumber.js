
export default function PartNATOStockNumber(context) {
    if (context.binding?.Material?.NATOStockNum) {
        return context.binding?.Material?.NATOStockNum;
    }
    return '-';
}
