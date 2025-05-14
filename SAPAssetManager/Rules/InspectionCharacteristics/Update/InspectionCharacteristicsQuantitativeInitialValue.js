
export default function InspectionCharacteristicsQuantitativeInitialValue(context) {
    let binding = context.binding;

    //ResultValue is of type EDM.Double so the initial value will be 0 for a new characteristic. 
    //We need to allow users to take 0 readings so if no reading has been taken then show empty value
    if (String(binding.ResultValue) === '0' && !binding['@sap.isLocal']) {
        return '';
    } else {
        return context.formatNumber(binding.ResultValue, '');
    }
}
