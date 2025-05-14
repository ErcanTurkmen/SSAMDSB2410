
export default function DocumentEditorIsCropMode(context) {
    let pageProxy = context.evaluateTargetPathForAPI('#Page:DocumentEditorPage');
    if (pageProxy) {
        let extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            return extension.isCropMode();
        }
        return false;
    }
    return false;
}
