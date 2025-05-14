import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWOSignatureVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'signature') && 
        !WorkOrderCompletionLibrary.isStepMandatory(context, 'signature');
}

