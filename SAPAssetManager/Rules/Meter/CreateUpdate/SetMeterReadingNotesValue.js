import MeterLibrary from '../Common/MeterLibrary';

export default function SetMeterReadingNotesValue(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    if (meterTransactionType.includes('EDIT')) {
        let equipment = context.evaluateTargetPathForAPI('#Page:-Current').binding.EquipmentNum;
        let register = context.binding.RegisterNum;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc,MeterReadingTime desc`).then(result => {
            if (result && result.length > 0 && result.getItem(0).MeterReaderNote) {
                return result.getItem(0).MeterReaderNote;
            }
            return '';
        });
    }
    return '';
}
