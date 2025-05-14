import CommonLibrary from '../../Common/Library/CommonLibrary';
export default function GIFilterCaptionOpen(context) {
   let plant = CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
   let returnStr = '';
   let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
   if (type === 'PurchaseOrderHeader') {
      let PurchaseOrderId = context.binding.PurchaseOrderId;
      let baseQuery = "$filter=((PurchaseOrderId eq '" + PurchaseOrderId + "') and ((OpenQuantity gt 0) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X')))";
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'PurchaseOrderItems', baseQuery).then(count => {    
         return context.localizeText('open_items_x', [count]);
      });
   } else if (type === 'StockTransportOrderHeader') {
      let STOrderId = context.binding.StockTransportOrderId;
      let baseQuery = "$filter=((StockTransportOrderId eq '" + STOrderId + "')";
      if (plant && plant === context.binding.SupplyingPlant) {
         baseQuery += " and (((OrderQuantity eq IssuedQuantity) and (IssuedQuantity eq 0)) or ((OrderQuantity gt IssuedQuantity) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X')))";
      } else {
         baseQuery += " and (((OrderQuantity eq ReceivedQuantity) and (ReceivedQuantity eq 0)) or ((OrderQuantity gt ReceivedQuantity) and (FinalDeliveryFlag ne 'X' and DeliveryCompletedFlag ne 'X')))";
      }
      baseQuery += ')';
      return context.count('/SAPAssetManager/Services/AssetManager.service', 'StockTransportOrderItems', baseQuery).then(count => {
         return context.localizeText('open_items_x', [count]);
      });
   }
   return returnStr;
}
