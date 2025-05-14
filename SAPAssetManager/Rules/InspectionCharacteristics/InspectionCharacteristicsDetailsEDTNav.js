export default function InspectionCharacteristicsDetailsEDTNav(context) {
    context._control.getTable().context.clientAPI.getPageProxy().setActionBinding(context.binding);
    return context._control.getTable().context.clientAPI.getPageProxy().executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/InspectionCharacteristicsDetails.action');
}
