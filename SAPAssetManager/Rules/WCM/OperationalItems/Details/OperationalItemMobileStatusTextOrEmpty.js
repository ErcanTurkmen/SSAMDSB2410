import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import { GetMobileStatusLabelOrEmpty } from '../../Common/MobileStatusTexts/GetMobileStatusLabelOrEmpty';

export default function OperationalItemMobileStatusTextOrEmpty(context) {
    return GetMobileStatusLabelOrNull(context, context.binding)
        .then(labelOrNull => labelOrNull || '');
}

export function GetMobileStatusLabelOrNull(context, wcmDocmuentItem) {
    return (wcmDocmuentItem.PMMobileStatus ? Promise.resolve(wcmDocmuentItem.PMMobileStatus) : GetWCMDocumentItemMobileStatus(context, wcmDocmuentItem))
        .then(pmMobileStatus => pmMobileStatus ? GetMobileStatusLabel(context, pmMobileStatus.MobileStatus, 'WCMDOCITEM') : null);
}

export function GetWCMDocumentItemMobileStatus(context, wcmDocumentItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', wcmDocumentItem['@odata.readLink'] + '/PMMobileStatus', [], '')
        .then(pmMobileStatus => ValidationLibrary.evalIsEmpty(pmMobileStatus) ? null : pmMobileStatus.getItem(0));  // single element is expected
}

/** retrieves the MobileStatusLabel by the mobilestatuscode and objectType, cached into the page's clientData
 * @param {IControlProxy | IPageProxy} context
 * @param {string} pmMobileStatusCode
 * @param {string} objectType
 * @returns {Promise<string>}
 */
export async function GetMobileStatusLabel(context, pmMobileStatusCode, objectType) {
    const encodedParams = `${pmMobileStatusCode}_${objectType}`;
    const clientData = (context.getPageProxy?.() || context.evaluateTargetPathForAPI(`#Page:${context.currentPage.definition.name}`)).getClientData();  // invoked from map, context is IClientAPI: does not have getPageProxy
    if (!(encodedParams in clientData)) {
        clientData[encodedParams] = GetMobileStatusLabelOrEmpty(context, pmMobileStatusCode, objectType);
    }
    return clientData[encodedParams];
}
