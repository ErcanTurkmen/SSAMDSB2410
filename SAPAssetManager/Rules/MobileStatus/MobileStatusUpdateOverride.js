import libCom from '../Common/Library/CommonLibrary';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';
import MobileStatusOperationObjectType from './MobileStatusOperationObjectType';

export default function MobileStatusUpdateOverride(context, status, mobileStatusNavLink, successAction, actionBinding) {
    let extendedProperties = {};
    //Force these detail pages to recalculate after updating a mobile status to keep toolbar in sync
    libCom.removeStateVariable(context, 'isAnyOperationStarted');
    libCom.removeStateVariable(context, 'isAnyWorkOrderStarted');
    let binding = actionBinding || context.binding;
    let operationBinding = libCom.getStateVariable(context, 'IsOnRejectOperationBinding');
    if (operationBinding && !binding) {
        binding = operationBinding;
    }

    const COMPLETE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    let ignore = false;

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' || binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') { //We pass up a dummy complete record here, since we don't yet know if complete checks will pass
        if (status.MobileStatus === COMPLETE || status.MobileStatus === REVIEW) {
            ignore = true;
            libCom.setStateVariable(context, 'MobileStatusReadLinkSaveRequired', binding[mobileStatusNavLink]['@odata.readLink']);
            let dummy = getStatusByMobileStatus(status, COMPLETE);
            status.MobileStatus = 'D-' + dummy; //Need a dummy status so the actual status can be updated on this record later after successful checks
        }
    }

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') { //We pass up a dummy complete record here, since we don't yet know if complete checks will pass
        if (libCom.isCurrentReadLinkLocal(binding['@odata.readLink'])) {
            extendedProperties.ObjectType = MobileStatusOperationObjectType();
        }

        if (status.MobileStatus === COMPLETE || status.MobileStatus === REVIEW) {
            ignore = true;
            let dummy = getStatusByMobileStatus(status, COMPLETE);
            status.MobileStatus = 'D-' + dummy; //Need a dummy status so the actual status can be updated on this record later after successful checks
        }
    }

    let updateMode = 'Merge';
    if (libClock.isCICOEnabled(context)) {
        updateMode = 'Replace'; //Force all properties to be passed for CICO feature so the same status can go up back-to-back if necessary
    }

    const headers = {
        'OfflineOData.NonMergeable': true,
        'Transaction.Ignore': ignore,
    };

    return {
        'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
        'Properties':
        {
            'Properties':
            {
                'MobileStatus': status.MobileStatus,
                'EAMOverallStatusProfile': status.EAMOverallStatusProfile || '',
                'EAMOverallStatus': status.EAMOverallStatus || '',
                'Status': status.Status,
                'EffectiveTimestamp': '/SAPAssetManager/Rules/DateTime/CurrentDateTime.js',
                'CreateUserGUID': '/SAPAssetManager/Rules/UserPreferences/UserPreferencesUserGuidOnCreate.js',
                'CreateUserId': '/SAPAssetManager/Rules/MobileStatus/GetSAPUserId.js',
                ...extendedProperties,
            },
            'Target':
            {
                'EntitySet': 'PMMobileStatuses',
                'ReadLink': binding[mobileStatusNavLink]['@odata.readLink'],
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Headers': headers,
            'RequestOptions': {
                'UpdateMode': updateMode,
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
            ...(successAction ? { 'OnSuccess': successAction } : {}),
            'ActionResult': {
                '_Name': 'MobileStatusUpdate',
            },
            'ShowActivityIndicator': true,
        },
    };
}

function getStatusByMobileStatus(status, COMPLETE) {
    return status.MobileStatus === COMPLETE ? 'COMPLETE': 'REVIEW';
}
