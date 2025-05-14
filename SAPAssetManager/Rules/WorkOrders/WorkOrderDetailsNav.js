import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import libCom from '../Common/Library/CommonLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import Logger from '../Log/Logger';
import WorkOrderChangeStatusOptions from './MobileStatus/WorkOrderChangeStatusOptions';
import pageToolbar from '../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import { WorkOrderDetailsPageName } from './Details/WorkOrderDetailsPageToOpen';

export default function WorkOrderDetailsNav(context, navigationFromOnlineDownloadBanner) {
    let actionBinding;
    let previousPageProxy;
    let pageProxy;
    let queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
    try {
        if (typeof context.getPageProxy === 'function') {
            actionBinding = context.getPageProxy().getActionBinding() || context.binding;
            previousPageProxy = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
            pageProxy = context.getPageProxy();
        } else {
            actionBinding = context.getActionBinding();
            previousPageProxy = context.evaluateTargetPathForAPI('#Page:-Previous');
            pageProxy = context;
        }
    } catch (err) {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
            Logger.error('METER' , 'No Previous Page Exists');
            actionBinding = context.getPageProxy().getActionBinding() || context.binding;
            pageProxy = navigationFromOnlineDownloadBanner ? previousPageProxy : context.getPageProxy();
            if (queryOptions.indexOf('$expand=') > 0) {
                let expandIndex = queryOptions.indexOf('$expand=');
                let beforeExpand = queryOptions.substring(0, expandIndex);
                let afterExpand = queryOptions.substring(expandIndex + 8);
                queryOptions = beforeExpand + '$expand=OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,' + afterExpand;
            } else {
                queryOptions = queryOptions + 'OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,';
            }

            if (actionBinding['@odata.type'] === '#sap_mobile.WorkOrderHeader') {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${actionBinding.OrderId}'`).then((order) => {
                    if (order.length) {
                        return navigationToOfflineDetails(context, actionBinding, pageProxy, queryOptions);
                    } else {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/OnlineWorkOrderDetailsNav.action');
                    }
                });
            } else {
                return navigationToOfflineDetails(context, actionBinding, pageProxy, queryOptions);
            }
        } else {
            actionBinding = context.getPageProxy().getActionBinding() || context.binding;
            pageProxy = navigationFromOnlineDownloadBanner ? previousPageProxy : context.getPageProxy();

            if (actionBinding['@odata.type'] === '#sap_mobile.WorkOrderHeader') {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${actionBinding.OrderId}'`).then((order) => {
                    if (order.length) {
                        return navigationToOfflineDetails(context, actionBinding, pageProxy, queryOptions);
                    } else {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/OnlineWorkOrderDetailsNav.action');
                    }
                });
            } else {
                return navigationToOfflineDetails(context, actionBinding, pageProxy, queryOptions);
            }
        }
    }

    if (libCom.getPageName(previousPageProxy) === 'PartDetailsPage' || libCom.getPageName(previousPageProxy) === 'OnlinePartDetailsPage') {
        let partsPreviousPage = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        if (libCom.getPageName(partsPreviousPage) === 'PartsListViewPage' || libCom.getPageName(partsPreviousPage) === 'OnlinePartsListViewPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                });
            });
        }
    }

    if (libCom.getPageName(previousPageProxy) === WorkOrderDetailsPageName(context) && previousPageProxy.getBindingObject().OrderId === actionBinding.OrderId) { //if the previous page was the parent workorder then, navigate back
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }

    if (libCom.getPageName(previousPageProxy) === 'InspectionLotDetailsPage') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        });
    } 

    if (libCom.getPageName(previousPageProxy) === 'ObjectDetailsViewPage') {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        });
    }

    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        if (queryOptions.indexOf('$expand=') > 0) {
            let expandIndex = queryOptions.indexOf('$expand=');
            let beforeExpand = queryOptions.substring(0, expandIndex);
            let afterExpand = queryOptions.substring(expandIndex + 8);
            queryOptions = beforeExpand + '$expand=OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,' + afterExpand;
        } else {
            queryOptions = queryOptions + 'OrderISULinks/ConnectionObject_Nav/Premises_Nav,OrderISULinks/Installation_Nav,OrderISULinks/Premise_Nav,OrderISULinks/Device_Nav/RegisterGroup_Nav/Division_Nav,OrderISULinks/DeviceCategory_Nav/Material_Nav,OrderISULinks/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,OrderISULinks/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,OrderISULinks/ConnectionObject_Nav/FuncLocation_Nav/ObjectStatus_Nav/SystemStatus_Nav,DisconnectActivity_Nav/DisconnectActivityType_Nav,DisconnectActivity_Nav/DisconnectActivityStatus_Nav,';
        }
    }
    pageProxy = navigationFromOnlineDownloadBanner ? previousPageProxy : context.getPageProxy();
    if (actionBinding['@odata.type'] === '#sap_mobile.WorkOrderHeader') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$filter=OrderId eq '${actionBinding.OrderId}'`).then((order) => {
            if (order.length) {
                return navigationToOfflineDetails(context, actionBinding, pageProxy, queryOptions);
            } else {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/OnlineWorkOrderDetailsNav.action');
            }
        });
    } else {
        return navigationToOfflineDetails(context, actionBinding, pageProxy, queryOptions);
    }
}

function generateToolbarItems(pageProxy) {
    return WorkOrderChangeStatusOptions(pageProxy, pageProxy.getActionBinding()).then(items => {
        return pageToolbar.getInstance().saveToolbarItems(pageProxy, items, WorkOrderDetailsPageName(pageProxy));
    });
}

function navigationToOfflineDetails(context, actionBinding, pageProxy, queryOptions) {
    const entitySetName = actionBinding['@odata.type'] === '#sap_mobile.WorkOrderHeader' ? 'My' + actionBinding['@odata.readLink'] : actionBinding['@odata.readLink'];
    return libCom.sleep(500).then(() => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySetName, [], queryOptions).then(function(result) {
            pageProxy.setActionBinding(result.getItem(0));
            return generateToolbarItems(pageProxy).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
            });
        });
    });
}
