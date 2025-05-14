import CommonLibrary from '../../Common/Library/CommonLibrary';
export default async function GIFilterCaptionConsumed(context) {
    let plant = CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
    let returnStr = '';
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'PurchaseRequisitionHeader') {
// no need for buttons  
    }  else if (type === 'PurchaseOrderHeader') {

        let PurchaseOrderId = context.binding.PurchaseOrderId;
        let baseQuery = "$filter=((PurchaseOrderId eq '" + PurchaseOrderId + "') and ((OpenQuantity eq 0) or (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X')))";
        let countConsumed = await context.count('/SAPAssetManager/Services/AssetManager.service', 'PurchaseOrderItems', baseQuery);       
    return context.localizeText('received_items_x', [countConsumed]);
 
    } else if (type === 'StockTransportOrderHeader') {

        let STOrderId = context.binding.StockTransportOrderId;
        let baseQuery = "$filter=((StockTransportOrderId eq '" + STOrderId + "')"; 
        if (plant && plant === context.binding.SupplyingPlant ) {
            baseQuery += " and (((OrderQuantity eq IssuedQuantity) and (IssuedQuantity ne 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X'))))"; 
            let countConsumed = await context.count('/SAPAssetManager/Services/AssetManager.service', 'StockTransportOrderItems', baseQuery);    
            return  context.localizeText('issued_items_x', [countConsumed]);
        } else {
            baseQuery += " and (((OrderQuantity eq ReceivedQuantity) and (ReceivedQuantity ne 0)) or ((OrderQuantity gt ReceivedQuantity) and (FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X'))))";
            let countConsumed = await context.count('/SAPAssetManager/Services/AssetManager.service', 'StockTransportOrderItems', baseQuery);    
            return context.localizeText('received_items_x', [countConsumed]);
        }
    } else {
        return returnStr;
    }
}
