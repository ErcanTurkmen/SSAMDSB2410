import libCom from '../../Common/Library/CommonLibrary';

export default function OrderValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/OrderFieldLength.global');
}
