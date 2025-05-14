export default async function GetInboundDeliveryReceivedCaption(context) {
    
    let countReceived = await context.count('/SAPAssetManager/Services/AssetManager.service', 'InboundDeliveryItems', 
        "$filter=(DeliveryNum eq '" + context.binding.DeliveryNum + "' and (PickedQuantity eq Quantity))");
    return context.localizeText('received_x', [countReceived]);

}
