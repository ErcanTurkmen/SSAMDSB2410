import libCom from '../../Common/Library/CommonLibrary';

export default function DeliveryNoteValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/DeliveryNoteFieldLength.global');
}
