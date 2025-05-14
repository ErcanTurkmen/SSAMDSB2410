export function IsBindingObjectOnline(context) {
    const binding = context.binding ?? context.getPageProxy().getActionBinding();
    const bindingType = binding?.['@odata.type'];
    return bindingType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineWorkOrder.global').getValue() 
        || bindingType === '#sap_mobile.WorkOrderOperation' 
        || bindingType === '#sap_mobile.NotificationHeader'
        || bindingType === '#sap_mobile.WorkOrderSubOperation';
}
