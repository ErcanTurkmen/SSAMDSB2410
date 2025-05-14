/**
* Get the Material with quantity
* @param {IClientAPI} context
*/
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
export default function QuantityWithUOM(context) {
    const binding = context.binding;
    if (!binding) {
        return '';
    }

    const {
        MaterialNum,
        UnrestrictedQuantity,
        UnrestrictedQty,
    } = binding;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], `$filter=MaterialNum eq '${MaterialNum}'`).then(Material => {
        const uom = ValidationLibrary.evalIsEmpty(Material) ? '' : Material.getItem(0).BaseUOM;
        return `${UnrestrictedQuantity ?? UnrestrictedQty}${uom ? ' ' + uom : ''}`;
    });
}
