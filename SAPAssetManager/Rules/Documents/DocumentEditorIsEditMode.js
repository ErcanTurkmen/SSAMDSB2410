
export default function DocumentEditorIsEditMode(context) {
    let pageProxy = context.evaluateTargetPathForAPI('#Page:DocumentEditorPage');
    if (pageProxy) {
        let extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            return extension.isEditMode();
        }
        return false;
    }
    return false;
}
