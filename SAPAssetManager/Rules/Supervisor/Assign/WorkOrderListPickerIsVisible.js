/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderListPickerIsVisible(context) {
    return !((context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') ||
        (context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation'));
}
