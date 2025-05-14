import style from '../../Common/Style/StyleFormCellButton';
import libCom from '../../Common/Library/CommonLibrary';
import equipmentCreateUpdateOnPageLoad from '../EquipmentCreateUpdateOnPageLoad';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';

export default function EqipmentCreateUpdateOnPageLoad(clientAPI) {
    equipmentCreateUpdateOnPageLoad(clientAPI);
    style(clientAPI, 'DiscardButton');
    SetUpAttachmentTypes(clientAPI);
    libCom.saveInitialValues(clientAPI);
}
