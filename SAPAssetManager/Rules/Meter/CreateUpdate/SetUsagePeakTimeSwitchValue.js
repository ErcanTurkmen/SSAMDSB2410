import MeterLibrary from '../Common/MeterLibrary';
import IsMeterTakeReadingFlow from './IsMeterTakeReadingFlow';

export default function SetUsagePeakTimeSwitchValue(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    if (meterTransactionType.includes('EDIT')) {
        let equipment = context.evaluateTargetPathForAPI('#Page:-Current').binding.EquipmentNum;
        let register = context.binding.RegisterNum;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc,MeterReadingTime desc`).then(result => {
            if (result && result.length > 0) {
                return !!result.getItem(0).DateMaxRead;
            }
            return false;
        });
    }

    let pageProxy = context.evaluateTargetPathForAPI('#Page:-Current');
    if (IsMeterTakeReadingFlow(pageProxy)) {
        return !!pageProxy.binding.DateMaxRead; 
    }  

    return false;
}
