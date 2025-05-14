import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SDFValue(context) {
    return WorkOrderCompletionLibrary.getStep(context, 'sapdynamicforms').count;
}
