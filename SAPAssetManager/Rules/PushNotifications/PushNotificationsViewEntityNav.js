import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import libCom from '../Common/Library/CommonLibrary';
import notificationNavQuery from '../Notifications/Details/NotificationDetailsQueryOptions';
import WorkOrderChangeStatusOptions from '../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import pageToolbar from '../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import NotificationChangeStatusOptions from '../Notifications/MobileStatus/NotificationChangeStatusOptions';
import { WorkOrderDetailsPageName } from '../WorkOrders/Details/WorkOrderDetailsPageToOpen';
import { NotificationDetailsPageName } from '../Notifications/Details/NotificationDetailsPageToOpen';
import ServiceOrderDetailsPageToOpen from '../ServiceOrders/ServiceOrderDetailsPageToOpen';
import S4ServiceOrderStatusesWrapper from '../ServiceOrders/S4ServiceOrderStatusesWrapper';

export default function PushNotificationsViewEntityNav(context) {
    let objectType = libCom.getStateVariable(context, 'ObjectType');
    let titleLocArgs = libCom.getStateVariable(context, 'TitleLocArgs');
    let entity = '';
    let queryOptions = '';
    let navigateRule = '';
    let mobileStatusOptionsFunc = '';
    let pageName = '';
    if (objectType === 'WorkOrder') {
        entity =  'MyWorkOrderHeaders('+ '\'' + titleLocArgs +'\''+')';
        queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
        navigateRule = '/SAPAssetManager/Rules/WorkOrders/WorkOrderDetailsNav.js';
        mobileStatusOptionsFunc = WorkOrderChangeStatusOptions;
        pageName = WorkOrderDetailsPageName(context);
    } else if (objectType === 'Notification') {
        entity =  'MyNotificationHeaders('+ '\'' + titleLocArgs +'\''+')';
        queryOptions =  notificationNavQuery(context);
        navigateRule = '/SAPAssetManager/Rules/Notifications/Details/NotificationDetailsNav.js';
        mobileStatusOptionsFunc = NotificationChangeStatusOptions;
        pageName = NotificationDetailsPageName(context);
    } else if (objectType === 'ServiceOrder') {
        entity = 'S4ServiceOrders';
        let expand = '$expand=MobileStatus_Nav/OverallStatusCfg_Nav,TransHistories_Nav/S4ServiceContract_Nav,RefObjects_Nav/Material_Nav,' +
        'Partners_Nav/BusinessPartner_Nav/Address_Nav/AddressGeocode_Nav/Geometry_Nav,' +
        'Partners_Nav/S4PartnerFunc_Nav,' +
        'RefObjects_Nav/Equipment_Nav/Address/AddressGeocode_Nav/Geometry_Nav,' +
        'RefObjects_Nav/FuncLoc_Nav/Address/AddressGeocode_Nav/Geometry_Nav,' +
        'S4ServiceErrorMessage_Nav';
        queryOptions = `$filter=HeaderGUID32 eq '${titleLocArgs}'&${expand}`;
        navigateRule = '/SAPAssetManager/Rules/ServiceOrders/ListView/ServiceOrderDetailsNav.js';
        mobileStatusOptionsFunc = S4ServiceOrderStatusesWrapper;
        pageName = ServiceOrderDetailsPageToOpen(context);
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], queryOptions).then((result) => {
        if (result && result.getItem(0)) {
            context.setActionBinding(result.getItem(0));
            return generateToolbarStatusOptions(context, mobileStatusOptionsFunc, pageName).then(() => {
                return context.executeAction(navigateRule);
            });
        }
        return '';
    });


}

function generateToolbarStatusOptions(context, getStatusOptionsFunc, pageName) {
    return getStatusOptionsFunc(context, context.getActionBinding()).then(items => {
        return pageToolbar.getInstance().saveToolbarItems(context, items, pageName).then(() => {
            return Promise.resolve();
        });
    });
}
