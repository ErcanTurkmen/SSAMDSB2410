export default function MetersListViewEntitySet(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return context.binding['@odata.readLink'] + '/OrderISULinks';
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return context.binding['@odata.readLink'] + '/WOHeader/OrderISULinks';
    } else if (context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
        return context.binding['@odata.readLink'] + '/WorkOrderOperation/WOHeader/OrderISULinks';
    } else {
        return context.binding['@odata.readLink'] + '/Devices_Nav';
    }
}
