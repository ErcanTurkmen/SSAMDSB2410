import libCommon from '../Common/Library/CommonLibrary';
import {WorkOrderLibrary as libWo} from './WorkOrderLibrary';
import WorkOrderDetailsNavLib from '../WorkOrders/WorkOrderDetailsNav';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import pageToolbar from '../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import WorkOrderChangeStatusOptions from './MobileStatus/WorkOrderChangeStatusOptions';
import { WorkOrderDetailsPageName } from './Details/WorkOrderDetailsPageToOpen';

export default function WorkOrderHighPriorityDetailsNav(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
        return WorkOrderDetailsNavLib(context);
    }

    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();
    if (libMobile.isHeaderStatusChangeable(pageProxy)) {
        return WorkOrderChangeStatusOptions(pageProxy, actionBinding).then(items => {
            return pageToolbar.getInstance().saveToolbarItems(pageProxy, items, WorkOrderDetailsPageName(context)).then(() => {
                return libCommon.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action', actionBinding['@odata.readLink'], libWo.getWorkOrderDetailsNavQueryOption(context));
            });
        });
    } else {
        return libCommon.navigateOnRead(pageProxy, '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action', actionBinding['@odata.readLink'], libWo.getWorkOrderDetailsNavQueryOption(context));
    }
}
