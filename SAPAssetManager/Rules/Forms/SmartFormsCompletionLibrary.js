import WorkOrderCompletionLibrary from '../WorkOrders/Complete/WorkOrderCompletionLibrary';
import FSMSmartFormsLibrary from './FSM/FSMSmartFormsLibrary';

export default class SmartFormsCompletionLibrary {
    
    static updateSmartformStep(context) {
        if (FSMSmartFormsLibrary.isSmartFormsFeatureEnabled(context)) {
            return SmartFormsCompletionLibrary.getSmartformsForCompletion(context).then(smartforms => {
                WorkOrderCompletionLibrary.updateStepState(context, 'smartforms', {
                    visible: SmartFormsCompletionLibrary.isSmartformsVisible(context, smartforms),
                    isMandatory: SmartFormsCompletionLibrary.isSmartformsMandatory(context, smartforms),
                    value: SmartFormsCompletionLibrary.getSmartformsStepValue(context, smartforms),
                    status: SmartFormsCompletionLibrary.getSmartformsStepStatus(context, smartforms),
                });

                return Promise.resolve();
            });
        }

        return Promise.resolve();
    }

    static isSmartformsVisible(context, smartforms) {
        let isVisible = false;
        
        if (FSMSmartFormsLibrary.isSmartFormsFeatureEnabled(context)) {
            let step = WorkOrderCompletionLibrary.getStep(context, 'smartforms');
            if (step.visible) {
                isVisible = step.visible;
            } else if (smartforms.length) {
                isVisible = true;
            }
        }

        return isVisible;
    }

    static isSmartformsMandatory(context, smartforms) {
        let isMandatory = false;
        
        if (FSMSmartFormsLibrary.isSmartFormsFeatureEnabled(context)) {
            let step = WorkOrderCompletionLibrary.getStep(context, 'smartforms');
            if (step.isMandatory) {
                isMandatory = step.isMandatory;
            } else if (smartforms.length) {
                isMandatory = smartforms.some(smartform => smartform.Mandatory);
            }
        }

        return isMandatory;
    }

    static getSmartformsStepValue(context, smartforms) {
        let isCompleted = false;

        if (FSMSmartFormsLibrary.isSmartFormsFeatureEnabled(context) && smartforms.length) {
            let mandatoryCount = smartforms.filter(smartform => smartform.Mandatory).length;
            let mandatoryCompletedCount = smartforms.filter(smartform => smartform.Mandatory && smartform.Closed).length;

            isCompleted = mandatoryCount === mandatoryCompletedCount;
        }
        
        return isCompleted;
    }

    static getSmartformsStepStatus(context, smartforms) {
        let value = '';

        if (FSMSmartFormsLibrary.isSmartFormsFeatureEnabled(context) && smartforms.length) {
            let mandatoryCount = smartforms.filter(smartform => smartform.Mandatory).length;
            let mandatoryCompletedCount = smartforms.filter(smartform => smartform.Mandatory && smartform.Closed).length;

            if (mandatoryCount === mandatoryCompletedCount) {
                value = context.localizeText('done');
            } else if (mandatoryCount) {
                value = context.localizeText('mandatory_smartforms_left_label', [mandatoryCompletedCount, mandatoryCount]);
            }
        }
        
        return value;
    }

    static getSmartformsForCompletion(context) {
        let query = SmartFormsCompletionLibrary.getSmartformsFilterQueryOption(context);
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances', [], query);
    }

    static getSmartformsFilterQueryOption(context) {
        let filter = '$filter=false';
        let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    
        if (binding) {
            if (WorkOrderCompletionLibrary.getInstance().isServiceItemFlow()) {
                filter= `$filter=S4ServiceOrderId eq '${binding.ObjectID}' and S4ServiceItemNumber eq '${binding.ItemNo}' and S4ObjectType eq '${binding.ObjectType}'`;
            } else if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow()) {
                filter = `$filter=S4ServiceOrderId eq '${binding.ObjectID}'`;
            } else if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
                filter = `$filter=WorkOrder eq '${binding.OrderId}' and Operation eq '${binding.OperationNo}'`;
            } else {
                filter = `$filter=WorkOrder eq '${binding.OrderId}'`;
            }
        }

        return filter;
    }

    static updateSmartFormsValidation(context) {
        return SmartFormsCompletionLibrary.getSmartformsForCompletion(context).then(smartforms => {
            let value = SmartFormsCompletionLibrary.getSmartformsStepValue(context, smartforms);
    
            if (value) {
                let currentPage = context.evaluateTargetPathForAPI('#Page:CompleteOrderScreen');
                let mandatorySection = currentPage.getControl('SectionedTable').getSection('MandatorySection');
                
                if (mandatorySection && mandatorySection.getVisible()) {
                    WorkOrderCompletionLibrary.resetValidationMessageForField(context, 'smartforms');
                }
            }
        });
    }
}
