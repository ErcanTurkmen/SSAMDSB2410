export default function MeasuringPointReadingValueAndReadingDifference(clientAPI) {
    let value = '-';
    let decimal = Number(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());
    
    if (clientAPI.binding.ReadingValue || (clientAPI.binding.HasReadingValue === 'X' && clientAPI.binding.ReadingValue === 0)) {
        const uom = clientAPI.binding.MeasuringPoint?.UoM || clientAPI.binding.UOM;
        if (clientAPI.binding.IsCounterReading === 'X') {
            value = clientAPI.formatNumber(clientAPI.binding.ReadingValue, '', {maximumFractionDigits: decimal, minimumFractionDigits : 0}) + ' ' + uom + ' (' +clientAPI.binding.CounterReadingDifference+')';
        } else {
            ///For some reason value would not display if not turned into string
            value = String(clientAPI.formatNumber(clientAPI.binding.ReadingValue, '', {maximumFractionDigits: decimal, minimumFractionDigits : 0})) + ' ' + uom;
        } 
    }
    return value;
}
