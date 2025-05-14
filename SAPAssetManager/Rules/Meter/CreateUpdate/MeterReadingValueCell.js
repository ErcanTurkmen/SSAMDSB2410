import MeterLibrary from '../Common/MeterLibrary';
import IsMeterTakeReadingFlow from './IsMeterTakeReadingFlow';

export default async function MeterReadingValueCell(context) {
    let controlParameters = {};
    let readingValue = await getMeterReadingValue(context);

    if (readingValue !== undefined) {
        controlParameters.Value = readingValue;
    }

    return {
        'Type': 'Number',
        'Name': 'ReadingValue',
        'IsMandatory': false,
        'IsReadOnly': false,
        'Property': 'ReadingValue',
        'OnValueChange': '',
        'Parameters': controlParameters,
    };
}

function getMeterReadingValue(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);

    const INSTALL_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallEditMeterType.global').getValue();
    const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();
    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();

    if (meterTransactionType === INSTALL_EDIT || meterTransactionType === REMOVE || meterTransactionType === REMOVE_EDIT) {
        let equipment = context.evaluateTargetPathForAPI('#Page:-Current').binding.EquipmentNum;
        let register = context.binding.RegisterNum;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc,MeterReadingTime desc`).then(result => {
            if (result && result.length > 0) {
                return result.getItem(0).MeterReadingRecorded;
            }
            return undefined;
        });
    }

    let pageProxy = context.evaluateTargetPathForAPI('#Page:-Current');
    if (IsMeterTakeReadingFlow(pageProxy)) {
        return Promise.resolve(pageProxy.binding.MeterReadingRecorded); 
    }  

    return Promise.resolve(undefined);
}
