import queryOptions from '../SubOperations/SubOperationsListViewQueryOption';
import libCom from '../Common/Library/CommonLibrary';
import SubOperationChangeStatusOptions from './SubOperationChangeStatusOptions';
import pageToolbar from '../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import { SubOperationDetailsPageName } from './SubOperationDetailsPageToOpen';

export default function SubOperationDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding;
    let previousPageProxy;

    try {
        actionBinding = pageProxy.getActionBinding();
        previousPageProxy = pageProxy.evaluateTargetPathForAPI('#Page:-Previous');
    } catch (error) {
        return generateStatusOptionsAndNavigate(pageProxy);
    }

    if (previousPageProxy) {
        if (libCom.getPageName(previousPageProxy) === SubOperationDetailsPageName(context) && previousPageProxy.getBindingObject().SubOperationNo === actionBinding.SubOperationNo) { //if the previous page was the parent workorder then, navigate back
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
    }

    return generateStatusOptionsAndNavigate(pageProxy);

}

function generateStatusOptionsAndNavigate(pageProxy) {
    /** @type {MyWorkOrderSubOperation} actionBinding */
    let actionBinding = pageProxy.getActionBinding();
    if (actionBinding?.['@odata.type'] === '#sap_mobile.WorkOrderSubOperation' || actionBinding?.['@odata.type'] === '#sap_mobile.WorkOrderOperation') {
        return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/OnlineSubOperationDetailsNav.action');
    }
    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions(pageProxy))
        .then(result => pageProxy.setActionBinding(result.getItem(0)))
        .then(() => SubOperationChangeStatusOptions(pageProxy, pageProxy.getActionBinding()))
        .then(items => pageToolbar.getInstance().saveToolbarItems(pageProxy, items, SubOperationDetailsPageName(pageProxy)))
        .then(() => {
            return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationDetailsNav.action');
        });
}
