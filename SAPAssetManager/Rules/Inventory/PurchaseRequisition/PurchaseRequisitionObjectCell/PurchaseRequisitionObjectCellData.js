import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default class PurchaseRequisitionObjectCellData {

    /** @param {IClientAPI & {binding: PurchaseRequisitionHeader}} context  */
    static PurchaseRequisitionDescription(context) {
        const date = context.binding.PurchaseRequisitionItem_Nav?.length && context.binding.PurchaseRequisitionItem_Nav[0].RequisitionDate;
        return date ? CommonLibrary.getFormattedDate(CommonLibrary.dateStringToUTCDatetime(date), context) : '';
    }

    /** @param {IClientAPI & {binding: PurchaseRequisitionHeader}} context  */
    static PurchaseRequisitionSubhead(context) {
        return context.binding.PurchaseRequisitionItem_Nav?.length && context.binding.PurchaseRequisitionItem_Nav[0].DocType;
    }

    /** @param {IClientAPI & {binding: PurchaseRequisitionHeader}} context  */
    static PurchaseRequisitionSubstatusText(context) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/PurchaseRequisitionItem_Nav`, '')
            .then(count => context.localizeText('number_of_items', [count]));
    }

    /** @param {IClientAPI & {binding: PurchaseRequisitionHeader}} context  */
    static PurchaseRequisitionIcons(context) {
        return CommonLibrary.isCurrentReadLinkLocal(context.binding['@odata.readLink']) ? [CommonLibrary.GetSyncIcon(context)] : [];
    }
}
