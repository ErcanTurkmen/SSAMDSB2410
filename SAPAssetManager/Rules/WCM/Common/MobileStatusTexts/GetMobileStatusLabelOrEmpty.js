import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

/**
 * @param {IClientAPI} context
 * @param {string} mobileStatus
 * @param {string} objectType
 * @returns {Promise<string>} */
export function GetMobileStatusLabelOrEmpty(context, mobileStatus, objectType) {
    return [mobileStatus, objectType].every(i => !ValidationLibrary.evalIsEmpty(i)) ? context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], `$filter=ObjectType eq '${objectType}' and MobileStatus eq '${mobileStatus}'&$select=TransitionTextKey`)
        .then((/** @type {ObservableArray<EAMOverallStatusConfig>} */ eamOverallStatusCfg) => ValidationLibrary.evalIsEmpty(eamOverallStatusCfg) ? '' : context.localizeText(eamOverallStatusCfg.getItem(0).TransitionTextKey))
        .catch(() => '' /** just ignore any errors */) : Promise.resolve('');
}
