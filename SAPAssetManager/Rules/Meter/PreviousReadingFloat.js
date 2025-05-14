import {ValueIfExists} from './Format/Formatter';

export default function PreviousReadingFloat(context, registerNum) {
    let equipment;

    if (context.binding.DeviceLink) {
        equipment = context.binding.DeviceLink.EquipmentNum;
    } else {
        equipment = context.binding.BatchEquipmentNum;
    }

    if (!equipment) {
        equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    }
    let register = registerNum || context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc`).then(function(result) {
        if (result && result.length > 0) {
            return ValueIfExists(Number(result.getItem(0).MeterReadingRecorded), 0);
        } else {
            return 0;
        }
    });
}
