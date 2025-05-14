import caption from './DocumentEditorCaption';
import DocumentEditorResizeVisible from './DocumentEditorResizeVisible';
import DoneButtonVisible from './DoneButtonVisible';

export default function DocumentEditorExitCropMode(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        const extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            pageProxy.setCaption(caption(context));
            pageProxy.setActionBarItemVisible('CropButton', true);
            pageProxy.setActionBarItemVisible('ResizeButton', DocumentEditorResizeVisible(context));
            pageProxy.setActionBarItemVisible('EditButton', true);
            pageProxy.setActionBarItemVisible('SaveButton', false);
            pageProxy.setActionBarItemVisible('DoneButton', DoneButtonVisible(context));

            extension.exitCropMode();
        }
    }
    return Promise.resolve(true);
}
