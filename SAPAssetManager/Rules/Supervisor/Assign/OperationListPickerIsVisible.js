/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OperationListPickerIsVisible(context) {
    return !(context.binding && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation');
}
