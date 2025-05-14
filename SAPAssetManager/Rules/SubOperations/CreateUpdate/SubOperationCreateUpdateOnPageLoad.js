import {SubOperationEventLibrary as libSubOpEvent} from '../SubOperationLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import libCom from '../../Common/Library/CommonLibrary';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';

export default function SubOperationCreateUpdateOnPageLoad(pageClientAPI) {
    hideCancel(pageClientAPI);
    libSubOpEvent.createUpdateOnPageLoad(pageClientAPI);
    style(pageClientAPI, 'DiscardButton');
    SetUpAttachmentTypes(pageClientAPI);
    libCom.saveInitialValues(pageClientAPI);
}
