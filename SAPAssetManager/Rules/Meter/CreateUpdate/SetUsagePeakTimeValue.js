import MeterLibrary from '../Common/MeterLibrary';
import IsMeterTakeReadingFlow from './IsMeterTakeReadingFlow';

export default function SetUsagePeakTimeValue(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    if (meterTransactionType.includes('EDIT')) {
        let equipment = context.evaluateTargetPathForAPI('#Page:-Current').binding.EquipmentNum;
        let register = context.binding.RegisterNum;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc,MeterReadingTime desc`).then(result => {
            if (result && result.length > 0 && result.getItem(0).DateMaxRead) {
                return result.getItem(0).DateMaxRead.split('T')[0] + 'T' + result.getItem(0).TimeMaxReading + ':00';
            }
            return '';
        });
    }

    let pageProxy = context.evaluateTargetPathForAPI('#Page:-Current');
    if (IsMeterTakeReadingFlow(pageProxy)) {
        return pageProxy.binding.DateMaxRead.split('T')[0] + 'T' + pageProxy.binding.TimeMaxReading + ':00';
    }  


    return '';
}
