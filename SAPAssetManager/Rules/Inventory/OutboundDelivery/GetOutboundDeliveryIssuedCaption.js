export default async function GetOutboundDeliveryIssuedCaption(context) {
    let deliveryNum = context.binding.DeliveryNum;
    let baseQuery = "$filter=(DeliveryNum eq '" + deliveryNum + "' and (PickedQuantity eq Quantity))";
    let countIssued = await context.count('/SAPAssetManager/Services/AssetManager.service', 'OutboundDeliveryItems', baseQuery);
 
    return context.localizeText('issued_x', [countIssued]);
}
