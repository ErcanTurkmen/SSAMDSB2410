
/** @param {IBindableSectionProxy} context  */
export default function WorkPermitsSimplePropertyCellCount(context) {
    return context.getPageProxy().count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMApplicationDocuments`, '');
}
