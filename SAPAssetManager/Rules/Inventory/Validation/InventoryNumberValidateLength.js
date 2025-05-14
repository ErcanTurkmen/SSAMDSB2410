import libCom from '../../Common/Library/CommonLibrary';

export default function InventoryNumberValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/InventoryNumberFieldLength.global');
}
