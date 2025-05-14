export default function DisplayValueMarkedJob(context) {
    let binding = context.getBindingObject();
    return binding.MarkedJob?.PreferenceValue === 'true';
}
