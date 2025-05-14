import MeterLibrary from '../Common/MeterLibrary';
import IsMeterTakeReadingFlow from './IsMeterTakeReadingFlow';

export default function InstallMeterPageCaption(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    let isLocal = context?.binding?.Device_Nav ? context.binding.Device_Nav['@sap.isLocal'] : false;

    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
    const INSTALL_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallEditMeterType.global').getValue();
    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();
    const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();

    const isTakeSingleReading = IsMeterTakeReadingFlow(context);
    if (isTakeSingleReading) return context.localizeText('take_reading');

    switch (meterTransactionType) {
        case INSTALL_EDIT:
            return context.localizeText('meter_edit');
        case INSTALL:
            return context.localizeText('install_meter');
        case REMOVE:
            return context.localizeText('uninstall_meter_new');
        case REMOVE_EDIT:
            return isLocal ? context.localizeText('meter_edit') : context.localizeText('take_reading');
        default:
            return context.localizeText('install_meter');
    }
}
