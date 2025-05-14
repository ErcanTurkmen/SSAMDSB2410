import libCom from '../../Common/Library/CommonLibrary';

export default function ItemTextValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/ItemTextFieldLength.global');
}
