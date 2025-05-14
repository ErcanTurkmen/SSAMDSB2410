import CommonLibrary from '../../Common/Library/CommonLibrary';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';
import HideCancelForErrorArchiveFix from '../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function ServiceQuotationCreateUpdateLoaded(context) {
    HideCancelForErrorArchiveFix(context);
    SetUpAttachmentTypes(context);
    CommonLibrary.saveInitialValues(context);
}
