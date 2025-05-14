import DocumentValidation from './DocumentValidation';
import CommonLibrary from '../Common/Library/CommonLibrary';

export default function DocumentValidationAndClosePage(context, descriptionCtrl='', attachmentCtrl='') {
    return DocumentValidation(context, descriptionCtrl, attachmentCtrl).then(() => {
        let skipClose = CommonLibrary.getStateVariable(context, 'skipToastAndClosePageOnDocumentCreate');
        if (skipClose) {
            CommonLibrary.setStateVariable(context, 'skipToastAndClosePageOnDocumentCreate', false);
        }
        return skipClose ? Promise.resolve() : context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    });
}
