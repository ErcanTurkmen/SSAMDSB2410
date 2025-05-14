import CommonLibrary from '../../../Common/Library/CommonLibrary';
import DocumentsIsVisible from '../../../Documents/DocumentsIsVisible';

export default function IsEquipmentAttachmentSectionVisible(context) {
    return CommonLibrary.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.EQ.Attach') === 'Y' && DocumentsIsVisible(context);
}
