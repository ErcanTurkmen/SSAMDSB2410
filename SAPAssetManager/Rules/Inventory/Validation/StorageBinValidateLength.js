import libCom from '../../Common/Library/CommonLibrary';

export default function StorageBinValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/StorageBinFieldLength.global');
}
