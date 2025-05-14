import libCom from '../../../Common/Library/CommonLibrary';
import { resetSubItemsEdtTable } from '../ServiceItemDetailsPageOnReturning';

export default function SubItemDiscardAction(context) {
    const pageProxy = context.currentPage.context.clientAPI;

    return pageProxy.executeAction('/SAPAssetManager/Actions/DiscardWarningMessage.action').then(successResult => {
        if (successResult.data) {
            pageProxy.setActionBinding(context.binding);
            return pageProxy.executeAction({
                Name: '/SAPAssetManager/Actions/ServiceItems/ServiceItemDelete.action',
                Properties: {
                    OnSuccess: '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessageNoClosePage.action',
                },
            }).then(() => {
                if (libCom.getPageName(pageProxy) === 'ServiceOrderDetailsPage') {
                    const sectionedTable = pageProxy.getControls()[0];
                    const edtSection = sectionedTable.getSection('ServiceItemsTableSection');
                    edtSection.redraw(true);
                } else {
                    resetSubItemsEdtTable(pageProxy);
                }
                pageProxy.redraw();
            });
        }
        return Promise.resolve();
    });
}
