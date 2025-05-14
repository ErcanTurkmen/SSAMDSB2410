export default async function GetOutboundDeliveryOpenCaption(context) {
    let deliveryNum = context.binding.DeliveryNum;
    let baseQuery = "$filter=(DeliveryNum eq '" + deliveryNum + "' and (PickedQuantity ne Quantity))";
    let countOpen = await context.count('/SAPAssetManager/Services/AssetManager.service', 'OutboundDeliveryItems', baseQuery);
 
    return context.localizeText('open_x', [countOpen]);
}
