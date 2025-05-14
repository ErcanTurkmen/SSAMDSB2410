export default function NotificationCreateUpdateProcessingContextLstPkrValue(context) {
    try {
        return context.evaluateTargetPath('#Control:NPCSeg/#SelectedValue');
    } catch (exc) {
        return '';
    }
}
