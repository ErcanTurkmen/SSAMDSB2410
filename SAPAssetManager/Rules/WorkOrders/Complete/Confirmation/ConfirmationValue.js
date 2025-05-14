import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ConfirmationValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'confirmation') || WorkOrderCompletionLibrary.getStepValue(context, 'confirmation_item');
}
