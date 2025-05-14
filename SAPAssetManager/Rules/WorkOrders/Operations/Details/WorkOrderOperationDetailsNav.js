import OperationChangeStatusOptions from '../../../Operations/MobileStatus/OperationChangeStatusOptions';
import pageToolbar from '../../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import { WorkOrderOperationDetailsPageNameToOpen } from './WorkOrderOperationDetailsPageToOpen';

export default function WorkOrderOperationDetailsNav(sectionedTableProxy) {
    let pageProxy = sectionedTableProxy.getPageProxy();
    let previousPageProxy;
    let actionBinding;
    let beforePreviousPageProxy;

    try {
        actionBinding = pageProxy.getActionBinding();
        previousPageProxy = pageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        beforePreviousPageProxy = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
    } catch (err) {
        return generateStatusItemsAndNavigate(pageProxy);
    }

    if (previousPageProxy) {
        if (libCom.getPageName(previousPageProxy) === 'ObjectListViewPage' && libCom.getPageName(beforePreviousPageProxy) === WorkOrderOperationDetailsPageNameToOpen(pageProxy)) {
            return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        }

        if (libCom.getPageName(previousPageProxy) === WorkOrderOperationDetailsPageNameToOpen(pageProxy) && previousPageProxy.getBindingObject().OperationNo === actionBinding.OperationNo) {
            return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
    }

    return generateStatusItemsAndNavigate(pageProxy);
}

function generateStatusItemsAndNavigate(pageProxy) {
    return OperationChangeStatusOptions(pageProxy, pageProxy.getActionBinding()).then(items => {
        return pageToolbar.getInstance().saveToolbarItems(pageProxy, items, WorkOrderOperationDetailsPageNameToOpen(pageProxy)).then(() => {
            return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
        });
    }).catch(error => {
        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), error);
        return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
    });
}
