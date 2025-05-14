import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ShowAccessoryButtonIcon(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    // for other types contantly returning this icon
    if (type === 'PurchaseRequisitionHeader' || type === 'PurchaseRequisitionItem') {
        const isLocal = CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        if (!isLocal) {
            return '';
        }
    }
    return '$(PLT, /SAPAssetManager/Images/edit-accessory.ios.png, /SAPAssetManager/Images/edit-accessory.android.png)';
}
