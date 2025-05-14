import CommonLibrary from '../../../Common/Library/CommonLibrary';
import SetUpAttachmentTypes from '../../../Documents/SetUpAttachmentTypes';
import { enableTimeUnitControlOnEdit, resetServiceItemFieldsOnCreateFromItem, updateCategorizationControlsOnEdit } from '../../../ServiceItems/CreateUpdate/CreateUpdateServiceItemPageLoaded';

export default async function CreateUpdateServiceQuotationItemPageLoaded(context) {
    SetUpAttachmentTypes(context);
    resetServiceItemFieldsOnCreateFromItem(context);
    await updateCategorizationControlsOnEdit(context);
    enableTimeUnitControlOnEdit(context);
    CommonLibrary.saveInitialValues(context);
}
