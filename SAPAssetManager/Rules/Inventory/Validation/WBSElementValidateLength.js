import libCom from '../../Common/Library/CommonLibrary';

export default function WBSElementValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/WBSElementFieldLength.global');
}
