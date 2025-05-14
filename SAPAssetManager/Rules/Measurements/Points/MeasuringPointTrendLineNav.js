import MeasuringPointDetailsNav from './MeasuringPointDetailsNav';
import Logger from '../../Log/Logger';

/**
* @param {IClientAPI} clientAPI
* @returns {Promise<*>}
* @throws {Error} error if the action binding does not have a point defined.
*/
export default function MeasuringPointTrendLineNav(clientAPI) {
    const pointId = clientAPI?.getPageProxy()?.getActionBinding()?.point?.[0];
    if (pointId === undefined) {
        throw new Error('MeasuringPointTrendLine - error identifying point value');
    }
    const readLink = `MeasuringPoints('${pointId}')`;
    clientAPI.getPageProxy().setActionBinding({Point: pointId, '@odata.readLink': readLink, disableReading: true});
    return MeasuringPointDetailsNav(clientAPI)
    .then((results) => {
        if (results && results.error) {
            const errorMessage = `Error navigating to point details: ${pointId} - ${results.error.message}`;
            Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), errorMessage);
        }
    }).catch((error) => {
        Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global').getValue(), `Error thrown when navigating to point details: ${pointId} - ${error}`);
    });
}
