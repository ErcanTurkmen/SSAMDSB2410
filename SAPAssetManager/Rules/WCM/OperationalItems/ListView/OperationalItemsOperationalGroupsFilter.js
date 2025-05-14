import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function OperationalItemsOperationalGroupsFilter(context) {
    return GetOperationalGroupValues(context)
        .then(values => ({
            name: 'OpGroup',
            values: values,
        }));
}

/**
 *  @param {IClientAPI} context
 *  @returns {Promise<Array<{ReturnValue: string, DisplayValue: string}>>}
  */
export function GetOperationalGroupValues(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMOpGroups', [], '')
        .then(result => ValidationLibrary.evalIsEmpty(result) ? [] : Array.from(result, (/** @type {WCMOpGroup} */ x) => ({ ReturnValue: x.OpGroup, DisplayValue: x.TextOpGroup })));
}
