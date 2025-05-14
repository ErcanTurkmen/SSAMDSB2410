import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCom from '../../Common/Library/CommonLibrary';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';
import { WorkOrderOperationDetailsPageNameToOpen } from './Details/WorkOrderOperationDetailsPageToOpen';

export default function PartsToOperationDetailsNav(context) {
    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    if (libCom.getPageName(previousPage) === 'PartsListViewPage' || libCom.getPageName(previousPage) === 'OnlinePartsListViewPage') {
        let partsListViewPreviousPage = previousPage.evaluateTargetPathForAPI('#page:-Previous');
        if (libCom.getPageName(partsListViewPreviousPage) === WorkOrderOperationDetailsPageNameToOpen(context)) {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        }
    }

    return OperationChangeStatusOptions(context, context.getPageProxy().getActionBinding()).then(items => {
        return pageToolbar.getInstance().saveToolbarItems(context, items, WorkOrderOperationDetailsPageNameToOpen(context)).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
        });
    });
}
