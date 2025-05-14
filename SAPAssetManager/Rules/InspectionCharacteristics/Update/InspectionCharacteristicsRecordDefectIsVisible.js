/**
* Returns true if the CalculatedCharFlag is not set
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsRecordDefectIsVisible(context) {
    return context.binding.Valuation === 'R';
}
