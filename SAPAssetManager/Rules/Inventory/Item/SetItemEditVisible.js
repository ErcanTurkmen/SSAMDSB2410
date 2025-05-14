import libCom from '../../Common/Library/CommonLibrary';

/**
 * Control edit button visibility
 * @param {import('../../../.typings/IClientAPI').IClientAPI} context 
 * @returns true if visible
 */

export default function SetItemEditVisible(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'PurchaseRequisitionHeader' || type === 'PurchaseRequisitionItem') {
        return libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    }
    return true;
}
