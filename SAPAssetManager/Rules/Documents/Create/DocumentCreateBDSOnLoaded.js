import libCom from '../../Common/Library/CommonLibrary';
import SetUpAttachmentTypes from '../SetUpAttachmentTypes';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentCreateBDSOnLoaded(context) {
    SetUpAttachmentTypes(context);
    libCom.saveInitialValues(context);
}
