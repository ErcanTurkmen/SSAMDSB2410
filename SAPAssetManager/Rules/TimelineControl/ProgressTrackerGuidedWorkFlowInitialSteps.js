import GuidedFlowGenerator from '../GuidedWorkFlow/GuidedFlowGenerator';

export default async function ProgressTrackerGuidedWorkFlowInitialSteps(context) {
    
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
    const guidedFlowGenerator = await new GuidedFlowGenerator(context, context.binding, objectType, mobileStatus);
    const currentStepSequence = await guidedFlowGenerator.getCurrentStepSequence();
    const flowSteps = await guidedFlowGenerator.generateFlowSteps();
    return createStepsFromFlowSteps(context, flowSteps, currentStepSequence, mobileStatus);
}

function createStepsFromFlowSteps(context, workFlowSteps, currentStepSequence, mobileStatus) {
    if (workFlowSteps && workFlowSteps.Steps.length > 0) {
        let data = [];
        let selectedIndex = 0;
        let index = 0;
        workFlowSteps.Steps.forEach((step)=> {
            const state = getStepState(step, currentStepSequence);
            let stepName = step.ToStep.replace(/[^A-Za-z0-9]+/g, '').toLowerCase();
            let localizedStepName = context.localizeText('flow_Step_'+ stepName);
            if (localizedStepName.indexOf('flow_Step_') !== -1) {
                localizedStepName = step.ToStep;
            }
            if (state === 1) {
                data.push({
                    'State': state,
                    'Title': localizedStepName,
                    'Subtitle': context.localizeText(mobileStatus),
                    'IsSelectable': false,
                });
            } else {
                data.push({
                    'State': state,
                    'Title': localizedStepName,
                    'Subtitle': '',
                    'IsSelectable': false,
                });
            }
            if (state === 1) {
                selectedIndex = index;
            }
            index++;
        });
        return {
            SelectedStepIndex: selectedIndex,
            Steps: data, 
        };
    }
    return {};
}

function getStepState(step, currentStepSequence) {
    if (currentStepSequence === parseInt(step.Sequence)) {
        return 1;
    } else if (currentStepSequence > parseInt(step.Sequence)) {
        return 2;
    } else {
        return 0;
    }
}
