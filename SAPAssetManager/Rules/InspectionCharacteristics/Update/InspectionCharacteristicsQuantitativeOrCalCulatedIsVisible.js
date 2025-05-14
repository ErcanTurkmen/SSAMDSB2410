import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsQuantitativeOrCalCulatedIsVisible(context) {
    let binding = context.binding;
    return (inspCharLib.isQuantitative(binding) || inspCharLib.isCalculatedAndQuantitative(binding));
}
