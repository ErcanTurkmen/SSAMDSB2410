import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import IsClassicLayoutEnabled from '../../Common/IsClassicLayoutEnabled';
import MeterLibrary from '../Common/MeterLibrary';
import MeterSectionLibrary from '../Common/MeterSectionLibrary';
import PromptReading from '../PromptReading';
import { replaceMeterWithInstallation } from './MeterReplaceInstall';

export default function PromptReadingWrapper(context) {
    const { REPLACE, REP_INST } = MeterSectionLibrary.getMeterISOConstants(context);
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);

    if (meterTransactionType === REP_INST) {
        replaceMeterWithInstallation(context, context.binding.EquipmentNum, context.binding.BatchEquipmentNum);
    }

    if (!IsClassicLayoutEnabled(context) && meterTransactionType !== REPLACE) {
        return showToastMessage(context);
    }
    return PromptReading(context);
}

function showToastMessage(context) {
    let meterTransactionType = MeterLibrary.getMeterTransactionType(context);
    let messageText = context.localizeText('meter_updated');

    const INSTALL = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/InstallMeterType.global').getValue();
    const REMOVE = context.getGlobalDefinition('/SAPAssetManager/Globals/Meter/RemoveMeterType.global').getValue();

    if (meterTransactionType === INSTALL) {
        messageText = context.localizeText('meter_installed');
    } else if (meterTransactionType === REMOVE) {
        messageText = context.localizeText('meter_uninstalled');
    } 

    return ExecuteActionWithAutoSync(context, {
        'Name': '/SAPAssetManager/Actions/Meters/CreateUpdate/MeterUpdatedToastMessage.action',
        'Properties': {
            'Message': messageText,
        },
    });
}
