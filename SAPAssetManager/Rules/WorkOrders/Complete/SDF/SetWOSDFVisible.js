import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWOSmartformsVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'sapdynamicforms') && 
        WorkOrderCompletionLibrary.isStepMandatory(context, 'sapdynamicforms');
}
