
import MeterLibrary from '../Common/MeterLibrary';

export default function IsInstallMeter(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
    const INSTALL_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallEditMeterType.global').getValue();
    return meterTransactionType === INSTALL || meterTransactionType === INSTALL_EDIT;
}
