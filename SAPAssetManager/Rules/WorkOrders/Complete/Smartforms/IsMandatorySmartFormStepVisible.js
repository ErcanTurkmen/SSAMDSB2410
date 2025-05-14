import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function IsMandatorySmartFormStepVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'smartforms') && 
        WorkOrderCompletionLibrary.isStepMandatory(context, 'smartforms');
}
