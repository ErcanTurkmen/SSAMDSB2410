import {DocumentEditorSaveFile} from './DocumentEditorOnSave';
import DocumentAutoResizeImage from './DocumentAutoResizeImage';
import DocumentEditorIsAutoResizeEnabled from './DocumentEditorIsAutoResizeEnabled';
import Logger from '../Log/Logger';
import CommonLibrary from '../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentEditorOnDoneButtonPress(context) {
    if (DocumentEditorIsAutoResizeEnabled(context)) {
        context.showActivityIndicator();
        return CommonLibrary.sleep(200).then(()=>{
            // long running task
            return DocumentAutoResizeImage(context).then(()=>{
                DocumentEditorSaveFile(context);
                context.dismissActivityIndicator();
                CommonLibrary.clearStateVariable(context, 'DocumentEdited');
                // done, so navigate back
                return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
            });
        });
    } else {
        Logger.debug('IMAGE_EDITOR', 'Auto-resize is not enabled');
        CommonLibrary.clearStateVariable(context, 'DocumentEdited');
        DocumentEditorSaveFile(context);
        return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
    }
}
