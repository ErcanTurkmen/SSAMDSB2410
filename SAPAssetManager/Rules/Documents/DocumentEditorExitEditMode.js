import caption from './DocumentEditorCaption';
import isImageFormat from './DocumentEditorIsImageFormatWrapper';
import DoneButtonVisible from './DoneButtonVisible';
import DocumentEditorResizeVisible from './DocumentEditorResizeVisible';

export default function DocumentEditorExitEditMode(context) {
    const pageProxy = context.getPageProxy();
    if (pageProxy) {
        const extension = pageProxy.getControl('DocumentEditorExtensionControl')._control;
        if (extension) {
            pageProxy.setCaption(caption(context));
            if (isImageFormat(context)) {
                pageProxy.setActionBarItemVisible('CropButton', true);
                pageProxy.setActionBarItemVisible('ResizeButton', DocumentEditorResizeVisible(context));
            }
            pageProxy.setActionBarItemVisible('EditButton', true);
            pageProxy.setActionBarItemVisible('ClearButton', false);
            pageProxy.setActionBarItemVisible('SaveButton', false);
            pageProxy.setActionBarItemVisible('DoneButton', DoneButtonVisible(context));
            extension.exitEditMode();
        }
    }
    return Promise.resolve(true);
}
