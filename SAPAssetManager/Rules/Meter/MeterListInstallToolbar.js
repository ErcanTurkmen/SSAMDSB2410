import MeterSectionLibrary from './Common/MeterSectionLibrary';

/**
* Hardcoding order type as far as we calling it from install button
* getting same as QAB action for this item
* @param {IClientAPI} clientAPI
*/
export default async function MeterListInstallToolbar(clientAPI) {
    const action = await MeterSectionLibrary.quickActionTargetValues(clientAPI, 'Action', undefined, 'INSTALL');
    return action && await clientAPI.executeAction(action);
}
