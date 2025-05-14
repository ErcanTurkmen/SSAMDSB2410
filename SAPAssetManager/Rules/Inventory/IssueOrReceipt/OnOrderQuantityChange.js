import CommonLibrary from '../../Common/Library/CommonLibrary';
import QuantityInBaseUOM from '../../Inventory/IssueOrReceipt/QuantityInBaseUOM';
export default function OnOrderQuantityChange(context) {
    CommonLibrary.clearValidationOnInput(context);
    const quantity = context.getPageProxy().getControl('FormCellContainer').getControl('BaseQuantityUOM');
    return QuantityInBaseUOM(context).then(results => {
        quantity.setValue(results);
    });
}
