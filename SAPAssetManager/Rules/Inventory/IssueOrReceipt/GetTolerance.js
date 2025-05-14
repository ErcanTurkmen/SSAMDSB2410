/**
* This function gets the tolerance limit of the Purchase order
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
export default function GetTolerance(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    let tolerance = '';

    if (type !== 'PO' || !(context.binding)) {
        return '';
    }
    const docType = context.binding['@odata.type'].substring('#sap_mobile.'.length);

    const binding = (docType === 'MaterialDocItem') ? context.binding.PurchaseOrderItem_Nav : context.binding;
    const overDeliveryTol = (binding.OverDeliveryTol === binding.OrderQuantity) ? 0 : context.formatNumber(Number(binding.OverDeliveryTol), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 });
    const underDeliveryTol = (binding.UnderDeliveryTol === binding.OrderQuantity) ? 0 : context.formatNumber(Number(binding.UnderDeliveryTol), '', { maximumFractionDigits: decimals, minimumFractionDigits : 0 });
    if (binding.UnlimitedTol === 'X') {
        tolerance = `${context.localizeText('del_tol')} ${context.localizeText('unlimited_tol')}`;
    } else if (overDeliveryTol) {
        tolerance = `${context.localizeText('overdel_tol')} ${overDeliveryTol} ${binding.OrderUOM}`;
    }
    if (underDeliveryTol) {
        if (!tolerance) {
            return `${context.localizeText('underdel_tol')} ${underDeliveryTol} ${binding.OrderUOM}`;
        }
        if (binding.UnlimitedTol === 'X') {
            return `${context.localizeText('del_tol')} ${underDeliveryTol} ${binding.OrderUOM} - ${context.localizeText('unlimited_tol')}`;
        }
        return `${context.localizeText('del_tol')} ${underDeliveryTol} - ${overDeliveryTol} ${binding.OrderUOM}`;
    }
    return tolerance;
}
