import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import GetMaterialUOM from '../../Inventory/Common/GetMaterialUOM';
export default async function BaseQuantityUOMValue(context) {
    const target = libCom.getStateVariable(context, 'SerialPageBinding');
    let quantity = 0;
    if (context.getPageProxy().getControl('SectionedTable')) {
        quantity = libLocal.toNumber(context, context.getPageProxy().getControl('SectionedTable').getControl('QuantitySimple').getValue());
    } else {
        quantity = context.binding.EntryQuantity;
    }
    if (isNaN(quantity)) {
        quantity = 0;
    }
    const uom = target.UOM;
    return GetMaterialUOM(context, target.Material, uom).then(TempLine_MaterialUOM => {
        let QuantityInBaseUOM = 0;
        if (TempLine_MaterialUOM && TempLine_MaterialUOM.BaseUOM !== uom) {
            QuantityInBaseUOM = quantity * TempLine_MaterialUOM.ConversionFactor;
            return QuantityInBaseUOM + ' ' + TempLine_MaterialUOM.BaseUOM;
        } else {
            return quantity + ' ' + uom;
        }
    });
}
