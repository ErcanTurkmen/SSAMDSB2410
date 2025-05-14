import libCommon from '../../Common/Library/CommonLibrary';

/**
* @param {IClientAPI} clientAPI
* @returns {Promise<boolean>}
*/
export default function IsFormReadOnly(clientAPI) {
    // only readonly for mandatory forms that are completed and also have a parent object that is completed
    if (   clientAPI.binding.DynamicFormInstance_Nav.Mandatory !== 'X' 
        || (   clientAPI.binding.DynamicFormInstance_Nav.FormStatus !== 'Completed' 
            && clientAPI.binding.DynamicFormInstance_Nav.FormStatus !== 'Final')) {
        return Promise.resolve(false);
    }
    const  WOCompletedMobileStatus = libCommon.getAppParam(clientAPI, 'MOBILESTATUS', clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

    return clientAPI.count(
        '/SAPAssetManager/Services/AssetManager.service',
        'DynamicFormLinkages',
        `$filter=FormInstanceID eq '${clientAPI.binding.FormInstanceID}' ` +
            `and (MyWorkOrderHeader_Nav/OrderMobileStatus_Nav/MobileStatus eq '${WOCompletedMobileStatus}' ` +
                `or MyWorkOrderOperation_Nav/OperationMobileStatus_Nav/MobileStatus eq '${WOCompletedMobileStatus}' ` +
                `or MyWorkOrderSubOperation_Nav/SubOpMobileStatus_Nav/MobileStatus eq '${WOCompletedMobileStatus}' ` +
                `or MyNotificationHeader_Nav/NotifMobileStatus_Nav/MobileStatus eq '${WOCompletedMobileStatus}')`,
    ).then((count) => count > 0);
}
