import libCom from '../../Common/Library/CommonLibrary';

export default function NetworkValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/NetworkFieldLength.global');
}
