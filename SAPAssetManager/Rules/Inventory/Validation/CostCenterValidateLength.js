import libCom from '../../Common/Library/CommonLibrary';

export default function CostCenterValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/CostCenterFieldLength.global');
}
