import PurchaseRequisitionLibrary from './PurchaseRequisitionLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function DiscardPurchaseRequisitionItem(context) {
    let onSuccessAction = '/SAPAssetManager/Rules/ApplicationEvents/AutoSync/actions/DeleteEntitySuccessMessageWithAutoSave.js';

    if (PurchaseRequisitionLibrary.isCreateListPage(context)) {
        onSuccessAction = '/SAPAssetManager/Actions/Common/CloseChildModal.action';
    }
    
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Inventory/PurchaseRequisition/DeletePurchaseRuqisitionItem.action',
        'Properties': {
            'Target': {
                'ReadLink': context.binding['@odata.readLink'],
            },
            'OnSuccess': onSuccessAction,
        },
    }).then(() => {
        let pageName = CommonLibrary.getCurrentPageName(context);
        if (pageName === 'ItemDetailsPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
        return Promise.resolve();
    });
}
