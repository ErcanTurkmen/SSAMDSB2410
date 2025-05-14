import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';

export default function DiscardPurchaseRequisition(context) {
    if (context.binding && context.binding.PurchaseReqNo) {
        PurchaseRequisitionLibrary.storeHeaderId(context, context.binding.PurchaseReqNo);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/ConfirmCloseCreatePage.action',
            'Properties': {
                'Message': context.localizeText('default_delete_message'),
                'Title': context.localizeText('discard'),
            },
        });
    }

    return Promise.reject();
}
