import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SalesOrderItemValidateLength(context) {
    CommonLibrary.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/SalesOrderItemFieldLength.global');
}
