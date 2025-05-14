import MeterLibrary from '../Common/MeterLibrary';
import IsMeterTakeReadingFlow from './IsMeterTakeReadingFlow';

export default function IsMeterReadingsTableVisible(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    const INSTALL_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallEditMeterType.global').getValue();
    const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();
    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();

    const isTakeSingleReading = IsMeterTakeReadingFlow(context);

    return meterTransactionType === INSTALL_EDIT || meterTransactionType === REMOVE || meterTransactionType === REMOVE_EDIT || isTakeSingleReading;
}
