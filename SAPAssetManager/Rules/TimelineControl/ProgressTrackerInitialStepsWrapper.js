import IsGuidedFlowEnabled from '../GuidedWorkFlow/IsGuidedFlowEnabled';
import ProgressTrackerInitialSteps from './ProgressTrackerInitialSteps';
import ProgressTrackerGuidedWorkFlowInitialSteps from './ProgressTrackerGuidedWorkFlowInitialSteps';
import ValidationLibrary from '../Common/Library/ValidationLibrary';
import GuidedFlowGenerator from '../GuidedWorkFlow/GuidedFlowGenerator';

export default async function ProgressTrackerInitialStepsWrapper(context) {
    let objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();
    let mobileStatus = '';
    if (IsGuidedFlowEnabled(context)) {
        if (context.binding) {
            let entityType = context.binding['@odata.type'];
            switch (entityType) {
                case '#sap_mobile.MyWorkOrderHeader':
                    mobileStatus = context.binding?.OrderMobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.MyWorkOrderOperation':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
                    mobileStatus = context.binding?.SubOpMobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.MyWorkOrderSubOperation':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
                    mobileStatus = context.binding?.SubOpMobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.S4ServiceOrder':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue();
                    mobileStatus = context.binding?.MobileStatus_Nav?.MobileStatus;
                    break;
                case '#sap_mobile.S4ServiceItem':
                    objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
                    mobileStatus = context.binding?.MobileStatus_Nav?.MobileStatus;
                    break;
                default:
                    break;
            }
        }
        let guidedFlowGenerator = await new GuidedFlowGenerator(context, context.binding, objectType, mobileStatus);
        let flowId = guidedFlowGenerator.getCurrentFlowId();
        if (ValidationLibrary.evalIsNotEmpty(flowId)) {
            return ProgressTrackerGuidedWorkFlowInitialSteps(context);
        }
    }
    return ProgressTrackerInitialSteps(context);
}
