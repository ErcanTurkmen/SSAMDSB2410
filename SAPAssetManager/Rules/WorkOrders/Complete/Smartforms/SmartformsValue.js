import SmartFormsCompletionLibrary from '../../../Forms/SmartFormsCompletionLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SmartformsValue(context) {
    return SmartFormsCompletionLibrary.getSmartformsForCompletion(context).then(smartforms => {
        let status = SmartFormsCompletionLibrary.getSmartformsStepStatus(context, smartforms);

        WorkOrderCompletionLibrary.updateStepState(context, 'smartforms', {
            status: status,
            value: SmartFormsCompletionLibrary.getSmartformsStepValue(context, smartforms),
        });

        return status || '';
    });
}
