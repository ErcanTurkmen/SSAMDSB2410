import ODataDate from '../Common/Date/ODataDate';

export default function PreviousReadingDate(context, registerNum) {
    let equipment = context.binding.EquipmentNum;
    if (context.binding.BatchEquipmentNum) {
        equipment = context.binding.BatchEquipmentNum;
    }
    let register = registerNum || context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc`).then(function(result) {
        let meterReadingDate;
        if (result && result.length > 0 && (meterReadingDate = result.getItem(0).MeterReadingDate)) {
            return meterReadingDate;
        } else {
            let odataDate = new ODataDate(new Date());
            return odataDate.toDBDateString(context);
        }
    });
}
