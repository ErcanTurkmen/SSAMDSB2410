import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function IsConfirmationtepVisible(context) {
    let step = WorkOrderCompletionLibrary.getStep(context, 'confirmation'); 
    return Promise.resolve(step.visible).then(visible => {
        return !!visible || WorkOrderCompletionLibrary.getStepValue(context, 'confirmation_item');
    });
}
