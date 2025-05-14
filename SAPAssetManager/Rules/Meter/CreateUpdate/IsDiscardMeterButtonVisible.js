import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import MeterLibrary from '../Common/MeterLibrary';

export default function IsDiscardMeterButtonVisible(context) {
    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
 
    return !IsClassicLayoutEnabled(context) && MeterLibrary.isLocal(context.binding) 
        && MeterLibrary.isProcessed(context.binding) && context.binding.ISUProcess === INSTALL;
}
