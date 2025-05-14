import common from '../Common/Library/CommonLibrary';
import personaLib from '../Persona/PersonaLibrary';
import isServiceItem from '../ServiceOrders/ServiceItems/IsServiceItemCategory';
import isGuidedFlowEnabled from '../GuidedWorkFlow/IsGuidedFlowEnabled';
import GuidedFlowGenerator from '../GuidedWorkFlow/GuidedFlowGenerator';
import ValidationLibrary from '../Common/Library/ValidationLibrary';

export default async function IsTimelineControlVisible(context) {
    let isVisible = false;
    let isCGWFEnabled = isGuidedFlowEnabled(context);
    if (isCGWFEnabled) {
        let objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();
        let mobileStatus = context.binding?.OrderMobileStatus_Nav?.MobileStatus;
        if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
            mobileStatus = context.binding?.OperationMobileStatus_Nav?.MobileStatus;
        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
            mobileStatus = context.binding?.SubOpMobileStatus_Nav?.MobileStatus;
        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/OrderMobileStatusObjectType.global').getValue();
            mobileStatus = context.binding?.MobileStatus_Nav?.MobileStatus;
        } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/ItemMobileStatusObjectType.global').getValue();
            mobileStatus = context.binding?.MobileStatus_Nav?.MobileStatus;
        }
        let guidedFlowGenerator = await new GuidedFlowGenerator(context, context.binding, objectType, mobileStatus);
        let flowId = guidedFlowGenerator.getCurrentFlowId();
        if (ValidationLibrary.evalIsEmpty(flowId)) {
            isCGWFEnabled = false;
        }
    }
    const pageProxy = context.getPageProxy();
    ///Enable control Visibility based on FSM persona and assigment type
    let entityset = common.getEntitySetName(pageProxy);
    switch (entityset) {
        case 'MyWorkOrderHeaders':       
            isVisible = ((isCGWFEnabled || personaLib.isFieldServiceTechnician(pageProxy)) && common.getWorkOrderAssnTypeLevel(pageProxy) === 'Header');
            break;
        case 'MyWorkOrderOperations':
            isVisible = ((isCGWFEnabled || personaLib.isFieldServiceTechnician(pageProxy)) && common.getWorkOrderAssnTypeLevel(pageProxy) === 'Operation');
            break;
        case 'MyWorkOrderSubOperations':
            isVisible = ((isCGWFEnabled || personaLib.isFieldServiceTechnician(pageProxy)) && common.getWorkOrderAssnTypeLevel(pageProxy) === 'SubOperation');
            break;
        case 'S4ServiceOrders':
        case 'S4ServiceRequests':
            isVisible = (common.getS4AssnTypeLevel(pageProxy) === 'Header' && personaLib.isFieldServiceTechnician(pageProxy));
            break;
        case 'S4ServiceItems':
            isVisible = (common.getS4AssnTypeLevel(pageProxy) === 'Item' && personaLib.isFieldServiceTechnician(pageProxy) && isServiceItem(pageProxy));
            break;
        default:
            break;
    }
    return isVisible;
}
