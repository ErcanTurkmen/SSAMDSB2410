import libCommon from '../../../../Common/Library/CommonLibrary';
import libMobile from '../../../../MobileStatus/MobileStatusLibrary';
import { WorkOrderDetailsPageName } from '../../../Details/WorkOrderDetailsPageToOpen';
import { SubOperationDetailsPageName } from '../../../../SubOperations/SubOperationDetailsPageToOpen';
import { WorkOrderOperationDetailsPageNameToOpen } from '../../../Operations/Details/WorkOrderOperationDetailsPageToOpen';
import ODataDate from '../../../../Common/Date/ODataDate';

export default function ActivityUpdateCommit(context) {
    let binding = context.binding;
    let receivedStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    let holdStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());

    if (libMobile.isOperationStatusChangeable(context)) { //Operation level assignment
        if (binding.MyWorkOrderOperation) { //During Operation Start
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding.MyWorkOrderOperation['@odata.readLink'] + '/OperationMobileStatus_Nav', [], '').then(result => {
                if (result && result.getItem(0)) {
                    let mobileStatus = result.getItem(0).MobileStatus;
                    if (mobileStatus === receivedStatus || mobileStatus === holdStatus) {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/Meter/OperationStartUpdate.action').then(() => {
                            let workorderDetailsContext = context.evaluateTargetPathForAPI(`#Page:${WorkOrderOperationDetailsPageNameToOpen(context)}`);
                            libMobile.setStartStatus(workorderDetailsContext);
                            libCommon.SetBindingObject(workorderDetailsContext);
                            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityUpdate.action').then(() => {
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityStatusUpdate.action');
                            });
                        });
                    }

                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityUpdate.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityStatusUpdate.action');
                    });
                }

                return Promise.resolve(false);
            });
        } else { //Activity Edit without Operation Mobile Status Change
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityUpdate.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityStatusUpdate.action');
            });
        }

    } else if (libMobile.isSubOperationStatusChangeable(context)) { //Suboperation level assignment
        if (binding.MyWorkOrderSubOperation) { //During Operation Start
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding.MyWorkOrderSubOperation['@odata.readLink'] + '/SubOpMobileStatus_Nav', [], '').then(result => {
                if (result && result.getItem(0)) {
                    let mobileStatus = result.getItem(0).MobileStatus;
                    if (mobileStatus === receivedStatus || mobileStatus === holdStatus) {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/Meter/SubOperationStartUpdate.action').then(() => {
                            let workorderDetailsContext = context.evaluateTargetPathForAPI(`#Page:${SubOperationDetailsPageName(context)}`);
                            libMobile.setStartStatus(workorderDetailsContext);
                            libCommon.SetBindingObject(workorderDetailsContext);
                            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityUpdate.action').then(() => {
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityStatusUpdate.action');
                            });
                        });
                    }

                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityUpdate.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityStatusUpdate.action');
                    });
                }

                return Promise.resolve(false);
            });
        } else { //Activity Edit without SubOperation Mobile Status Change
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityUpdate.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityStatusUpdate.action');
            });
        }

    } else if (libMobile.isHeaderStatusChangeable(context)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', binding.WOHeader_Nav['@odata.readLink'] + '/OrderMobileStatus_Nav', [], '').then(result => {
            if (result && result.getItem(0)) {
                let mobileStatus = result.getItem(0).MobileStatus;

                if (mobileStatus === receivedStatus || mobileStatus === holdStatus) {
                    let odataDate = new ODataDate();
                    libCommon.setStateVariable(context, 'StatusStartDate', odataDate.date());
                    let startDate = odataDate.toDBDateTimeString(context);
                    return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/WorkOrderStartUpdate.action', 'Properties': {
                        'Target':
                        {
                            'EntitySet' : 'PMMobileStatuses',
                            'Service' : '/SAPAssetManager/Services/AssetManager.service',
                            'ReadLink': binding.WOHeader_Nav.OrderMobileStatus_Nav['@odata.readLink'],
                        },
                        'Properties':
                        {
                            'ObjectKey' : binding.WOHeader_Nav.OrderMobileStatus_Nav.ObjectKey,
                            'ObjectType' : binding.WOHeader_Nav.OrderMobileStatus_Nav.ObjectType,
                            'MobileStatus' : libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue()),
                            'EffectiveTimestamp' : startDate,
                            'CreateUserGUID' : libCommon.getUserGuid(context),
                            'CreateUserId' : libCommon.getSapUserName(context),
                        },
                        'Headers':
                        {
                            'OfflineOData.NonMergeable': true,
                        },
                    }}).then(() => {
                        let workorderDetailsContext = context.evaluateTargetPathForAPI(`#Page:${WorkOrderDetailsPageName(context)}`);
                        libMobile.setStartStatus(workorderDetailsContext);
                        libCommon.SetBindingObject(workorderDetailsContext);
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityUpdate.action').then(() => {
                            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityStatusUpdate.action');
                        });
                    });
                }

                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityUpdate.action').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/CreateUpdate/ActivityStatusUpdate.action');
                });
            }

            return Promise.resolve(false);
        });
    }
}
