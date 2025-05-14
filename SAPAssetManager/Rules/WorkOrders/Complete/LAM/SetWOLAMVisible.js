import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWOLAMVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'time') && 
        WorkOrderCompletionLibrary.getStep(context, 'time').lam;
}
