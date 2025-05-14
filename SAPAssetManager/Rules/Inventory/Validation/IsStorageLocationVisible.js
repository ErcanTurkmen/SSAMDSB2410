import libInv from '../Common/Library/InventoryLibrary';
import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';
/**
* Funtion: if context.binding['@odata.type'] odata.type contains InboundDeliveryItem AND Material is blank
* or if odata.type contains PurchaseOrderItem AND MaterialNum is blank
* then storagelocation should not be displayed.
* If materialNum not blank, then check if MaterialType is NLAG (non-stock) then don't display storagelocation
 */
export default function IsStorageLocationVisible(context, bindingObject = undefined) {
    let binding;
    const objectType = libCom.getStateVariable(context,'IMObjectType');//PO/STO/RES/IN/OUT/ADHOC/MAT
    const moveType = libCom.getStateVariable(context, 'IMMovementType');//I/R/T

    // when creating a new document, the context.binding is undefined.
    // need to check if document is ADHOC and GI, GR or Stock Transfer, and return true.
    if ( objectType === 'ADHOC' && (moveType === 'I' || moveType === 'R' || moveType === 'T')) {
        return true;
    }

    binding =  bindingObject || context.binding ||  context.getActionBinding();

    let materialNum = libInv.getInventoryDocumentMaterialNum(binding);

    if (materialNum && !libInv.isFreeTextMaterial(materialNum)) {     
        const queryOptions = "$filter=MaterialNum eq '" + materialNum + "'";
        // query to get MaterialType and check for NLAG (non-stock material)
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], queryOptions).then((result) => {
            return !(result?.length > 0 && result.getItem(0).MaterialType === 'NLAG');
        }).catch(err => {
            Logger.warn(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryMaterialDocItems.global').getValue(), err);
            return false;
        });
    } else {  // if materialnum not defined then check if PurchaseOrder, IBD or MateriaDocItem
        const odataType = binding['@odata.type'];
        const excludedTypes = ['PurchaseOrderItem', 'InboundDeliveryItem', 'MaterialDocItem'];
        if (odataType && excludedTypes.some(type => odataType.substring('#sap_mobile.'.length) === type)) {
            return false;
        }
    }
    return true;
}
