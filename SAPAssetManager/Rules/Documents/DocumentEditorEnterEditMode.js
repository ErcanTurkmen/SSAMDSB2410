
export default function DocumentEditorEnterEditMode(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        const extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            pageProxy.setCaption(context.localizeText('edit'));
            pageProxy.setActionBarItemVisible('CropButton', false);
            pageProxy.setActionBarItemVisible('ResizeButton', false);
            pageProxy.setActionBarItemVisible('EditButton', false);
            pageProxy.setActionBarItemVisible('ClearButton', true);
            pageProxy.setActionBarItemVisible('SaveButton', true);
            pageProxy.setActionBarItemVisible('DoneButton', false);
            extension.enterEditMode();
        }
    }
    return Promise.resolve(true);
}
