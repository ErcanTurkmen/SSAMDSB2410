
import MeterLibrary from '../Common/MeterLibrary';

export default function DoneButtonText(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);

    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
    const INSTALL_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallEditMeterType.global').getValue();

    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();
    const REMOVE_EDIT = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveEditMeterType.global').getValue();

    switch (meterTransactionType) {
        case REMOVE_EDIT:
        case INSTALL_EDIT:
            return context.localizeText('done');
        case INSTALL:
            return context.localizeText('install_button_label');
        case REMOVE:
            return (!MeterLibrary.isLocal(context.binding) || !MeterLibrary.isProcessed(context.binding)) ?
                context.localizeText('uninstall') : context.localizeText('done');
        default:
            return context.localizeText('done');
    }
}
