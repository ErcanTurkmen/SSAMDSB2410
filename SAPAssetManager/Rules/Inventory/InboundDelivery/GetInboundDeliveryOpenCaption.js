export default async function GetInboundDeliveryOpenCaption(context) {
    let countOpen = await context.count('/SAPAssetManager/Services/AssetManager.service', 'InboundDeliveryItems', 
        "$filter=(DeliveryNum eq '" + context.binding.DeliveryNum + "' and (PickedQuantity ne Quantity))");
    return context.localizeText('open_x', [countOpen]);

}
