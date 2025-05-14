export default function ValuationStyleTable(context) {
    switch (context.binding.Valuation) {
        case 'A':
            return 'AcceptedGreenTableRowText';
        case 'R':
        case 'F':
            return 'RejectedRedTableRowText';
        default:
            return 'GrayTextTableRowText';
    }
}
