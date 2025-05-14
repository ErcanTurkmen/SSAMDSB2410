import IsMeterComponentEnabled from '../ComponentsEnablement/IsMeterComponentEnabled';
import Logger from '../Log/Logger';
import { removerMeterReplacementWithInstallation } from '../Meter/CreateUpdate/MeterReplaceInstall';
import DeleteEntitySuccessMessageWithAutoSave from './AutoSync/actions/DeleteEntitySuccessMessageWithAutoSave';

export default function AfterErrorDiscard(context) {
    UpdateStateVariablesAfterDiscard(context);
    return DeleteEntitySuccessMessageWithAutoSave(context);
}

export function UpdateStateVariablesAfterDiscard(context) {
    const discardResult = context.getActionResult('DiscardResult');
    UpdateMeterStateVariable(context, discardResult?.data);
}

function UpdateMeterStateVariable(context, discardResultData) {
    if (IsMeterComponentEnabled(context) && discardResultData) {
        try {
            const parsedData = JSON.parse(discardResultData);
            const url = parsedData?.RequestURL || '';
            if ((url.includes('OrderISULink') || url.includes('Device')) && parsedData?.RequestBody) {
                const parsedRequestBody = JSON.parse(parsedData.RequestBody);
                const installedMeterId = parsedRequestBody?.EquipmentNum;
                removerMeterReplacementWithInstallation(context, installedMeterId);
            }
        } catch (error) {
            Logger.error('UpdateStateVariablesAfterDiscard', error);
        }
    }
}
