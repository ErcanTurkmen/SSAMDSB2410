import libInv from './Library/InventoryLibrary';
import libComm from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

/**
 * This function returns the material Name Description based on the Material or MaterialNum query.
 * If the Material or MaterialNum is blank, then use ItemText or ItemDescription.
 * This is used for PurchaseOrder, IBD, STO or MatDocItem Details page
 * 
*/
export default function GetMaterialName(context, item) {
    const binding = item || context.getPageProxy().getClientData()?.item || context.binding.item || context.binding;
    let type = binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'ProductionOrderItem') {
        // avoid extra request for PRD as it has description in the navlink
        return Promise.resolve(binding.Material_Nav.Description);
    }
    let materialNum = libInv.getInventoryDocumentMaterialNum(binding);
    
    // If materialNum is blank then use ItemText (PurchaseOrderItem) or ItemDescript (InboundDeliveryItem)
    if (!libComm.isDefined(materialNum) || libInv.isFreeTextMaterial(materialNum)) { 
        //use ItemText or ItemDescript
        return Promise.resolve(binding.ItemText || binding.ItemDescript);
    }

    const queryOptions = "$filter=MaterialNum eq '" + materialNum + "'";
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], queryOptions).then((result) => {
        if (result && result.length > 0) {
            return result.getItem(0).Description;
        } else {
            return '';
        }
    }).catch(err => {
        Logger.warn(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryMaterialDocItems.global').getValue(), err);
        return '';
    });
}
