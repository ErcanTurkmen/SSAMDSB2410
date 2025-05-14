import libCom from '../../Common/Library/CommonLibrary';

export default function BillOfLadingValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/BillOfLadingFieldLength.global');
}
