import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function IsSmartFormStepVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'smartforms') && 
        !WorkOrderCompletionLibrary.isStepMandatory(context, 'smartforms');
}
