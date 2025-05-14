import libCom from '../../Common/Library/CommonLibrary';
import libWOStatus from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libOPStatus from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import SupervisorLibrary from '../SupervisorLibrary';

//Reject an object as a supervisor or as field service tech
export default function RejectReasonPhaseModelNav(context) {

    libCom.setStateVariable(context, 'SupervisorRejectSuccess', false);
    if (!context.binding) {
        libCom.setStateVariable(context, 'SupervisorRejectReadLink', context.getPageProxy().getActionBinding());
    }
    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Reject/RejectReasonNav.action').then(() => {
        if (libCom.getStateVariable(context, 'SupervisorRejectSuccess')) {
            let statusElement = libCom.getStateVariable(context, 'PhaseModelStatusElement');
            return SupervisorLibrary.isUserSupervisor(context).then(isUserSupervisor => {
                const roleType = isUserSupervisor ? 'S' : 'T';
                return MobileStatusUpdateOverride(context, statusElement, roleType).then(() => {
                    return UpdateStatus(context).then(() => {
                        libCom.removeStateVariable(context, 'SupervisorRejectSuccess');
                        libCom.removeStateVariable(context, 'RejectionReasonCode');
                        libCom.removeStateVariable(context, 'SupervisorRejectReadLink');
                        return libAutoSync.autoSyncOnStatusChange(context);
                    });
                });
            });
        }
        return false;
    });
}

function UpdateStatus(context) {
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        libWOStatus.didSetWorkOrderDisapproved(context);
    } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        libOPStatus.didSetOperationDisapproved(context);
    } else if (businessObject['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        libWOStatus.didSetServiceOrderRejected(context);
    } else if (businessObject['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        libOPStatus.didSetServiceItemRejected(context);
    }
    return Promise.resolve(true);
}

/**
 * Update the mobile status to rejected
 * @param {*} context
 * @param {*} status
 * @returns
 */
function MobileStatusUpdateOverride(context, status, roleType, actionBinding) {
    let updateMode = 'Merge';
    let properties =  {
        'MobileStatus': status.MobileStatus,
        'EAMOverallStatusProfile': status.EAMOverallStatusProfile || '',
        'EAMOverallStatus': status.EAMOverallStatus || '',
        'Status': status.Status,
        'EffectiveTimestamp': '/SAPAssetManager/Rules/DateTime/CurrentDateTime.js',
        'CreateUserGUID': '/SAPAssetManager/Rules/UserPreferences/UserPreferencesUserGuidOnCreate.js',
        'CreateUserId': '/SAPAssetManager/Rules/MobileStatus/GetSAPUserId.js',
        'ReasonCode': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonCode.js',
        'RoleType': roleType,
    };

    let businessObject = actionBinding || context.binding;
    if (businessObject && businessObject['@odata.type'].includes('S4Service')) {
        properties.ObjectType = status.ObjectType;
        properties.BusinessObjectType = businessObject.ObjectType;
        properties.S4RejectionCode = '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonCode.js';
        updateMode = 'Replace';

        if (businessObject['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            properties.BusinessObjectType = businessObject.ItemObjectType;
        }
    }

    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
        'Properties':
        {
            'Properties': properties,
            'Target':
            {
                'EntitySet': 'PMMobileStatuses',
                'ReadLink' : '/SAPAssetManager/Rules/MobileStatus/MobileStatusReadLink.js',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Headers': {
                'OfflineOData.NonMergeable': true,
            },
            'UpdateLinks':
            [{
                'Property': 'OverallStatusCfg_Nav',
                'Target':
                {
                    'EntitySet': 'EAMOverallStatusConfigs',
                    'ReadLink': `EAMOverallStatusConfigs(Status='${status.Status}',EAMOverallStatusProfile='${status.EAMOverallStatusProfile || ''}')`,
                },
            }],
            'RequestOptions': {
                'UpdateMode': updateMode,
            },
            'ShowActivityIndicator': true,
            'OnFailure': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action',
        },
    });
}
