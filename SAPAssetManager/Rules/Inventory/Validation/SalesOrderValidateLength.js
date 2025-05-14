import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SalesOrderValidateLength(context) {
    CommonLibrary.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/SalesOrderFieldLength.global');
}
