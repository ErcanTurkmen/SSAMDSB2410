export default function InspectionPointReviewCharacteristics(context) {
    let binding = context.getActionResult('ReadResult').data.getItem(0);
    context.getPageProxy().setActionBinding(binding);
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/InspectionPoints/InspectionPointReviewCharacteristics.action');
}
