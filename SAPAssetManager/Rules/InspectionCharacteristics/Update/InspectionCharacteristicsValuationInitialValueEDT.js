
export default function InspectionCharacteristicsValuationInitialValueEDT(context) {
    if (context.binding.InspValuation_Nav) {
        return context.binding.InspValuation_Nav.ShortText;
    } else {
        return '-';
    }
}
