import CommonLibrary from '../../../Common/Library/CommonLibrary';
import PhaseLibrary from '../../../PhaseModel/PhaseLibrary';

export default async function CreateSubOperationMobileStatus(context) {
    const binding = context.binding;
    const localWorkOrderID = CommonLibrary.getStateVariable(context, 'workOrderId');
    let isPhaseOrder;

    if (binding && binding.WOHeader) {
        isPhaseOrder = await PhaseLibrary.isPhaseModelActiveInDataObject(context, binding);      
    } else if (localWorkOrderID) {
        const workOrder = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${localWorkOrderID}')`, [], '').then(result => result.getItem(0));
        isPhaseOrder = await PhaseLibrary.isPhaseModelActiveInDataObject(context, workOrder);
    }

    if (isPhaseOrder) { // Set Ready status to sub-operation when the parent order is phase order
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusSubOperationSetReceived.action',
            'Properties': {
                'Properties': {
                    'MobileStatus': CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReadyParameterName.global').getValue()),
                },
                'CreateLinks': [
                    {
                        'Property': 'OverallStatusCfg_Nav',
                        'Target': {
                            'EntitySet': 'EAMOverallStatusConfigs',
                            'ReadLink': "EAMOverallStatusConfigs(Status='R125',EAMOverallStatusProfile='PMSP1')",
                        },
                    },
                    {
                        'Property': 'WOSubOperation_Nav',
                        'Target': {
                            'EntitySet' : 'MyWorkOrderSubOperations',
                            'ReadLink': '/SAPAssetManager/Rules/MobileStatus/MobileStatusLocalSubOperationReadLink.js',
                        },
                    },
                ],
                'Headers': {
                    'Transaction.Ignore': true,
                    'OfflineOData.RemoveAfterUpload': true,
                },
            },
        });
    }

    return context.executeAction('/SAPAssetManager/Actions/MobileStatus/MobileStatusSubOperationSetReceived.action');
}
