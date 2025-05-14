
export default function DocumentEditorEnterCropMode(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        const extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            pageProxy.setCaption(context.localizeText('crop'));
            pageProxy.setActionBarItemVisible('CropButton', false);
            pageProxy.setActionBarItemVisible('ResizeButton', false);
            pageProxy.setActionBarItemVisible('EditButton', false);
            pageProxy.setActionBarItemVisible('SaveButton', true);
            pageProxy.setActionBarItemVisible('DoneButton', false);
            extension.enterCropMode();
        }
    }
    return Promise.resolve(true);
}
