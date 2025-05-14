import CommonLibrary from '../../../Common/Library/CommonLibrary';
import DocumentsIsVisible from '../../../Documents/DocumentsIsVisible';

export default function IsFunctionalLocationAttachmentSectionVisible(context) {
    return CommonLibrary.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Attach') === 'Y' && DocumentsIsVisible(context);
}
