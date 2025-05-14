/**
* @param {IClientAPI} context
*/
export default function ReferenceDocNumberPickerItems(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsHuDelItems', [], '$orderby=ReferenceDocNumber')
        .then((referenceDocNumber) => [... new Set(Array.from(referenceDocNumber, c => c.ReferenceDocNumber))]
        .map(uniqueReferenceDocNumber => ({
            'DisplayValue': `${uniqueReferenceDocNumber}`,
            'ReturnValue': `${uniqueReferenceDocNumber}`,
        })));
}
