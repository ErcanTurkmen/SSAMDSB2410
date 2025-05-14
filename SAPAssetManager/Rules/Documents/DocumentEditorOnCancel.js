import isEditMode from './DocumentEditorIsEditMode';
import exitEditMode from './DocumentEditorExitEditMode';
import isCropMode from './DocumentEditorIsCropMode';
import exitCropMode from './DocumentEditorExitCropMode';
import setFileInfo from './DocumentEditorSetFileInfo';

export default function DocumentEditorOnCancel(context) {
    if (isEditMode(context) || isCropMode(context)) {
        return context.executeAction('/SAPAssetManager/Actions/Documents/DocumentEditorOnCancel.action').then((result) => {
            if (result.data === true) {
                setFileInfo(context, undefined);
                if (isEditMode(context)) {
                    return exitEditMode(context);
                } else if (isCropMode(context)) {
                    return exitCropMode(context);
                }
            }
            return Promise.resolve(true);
        });
    }
    setFileInfo(context, undefined);
    return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');
}
