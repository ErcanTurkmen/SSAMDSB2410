
export default function DocumentEditorClearAnnotation(context) {
    let pageProxy = context.getPageProxy();
    if (pageProxy) {
        let extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            extension.clearAnnotations();
        }
    }
}
