import libCom from '../../Common/Library/CommonLibrary';

export default function GLAccountValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/GLAccountFieldLength.global');
}
