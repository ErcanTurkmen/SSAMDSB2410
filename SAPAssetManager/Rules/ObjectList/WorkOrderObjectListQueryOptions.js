/**
 * Creates the query that is used by the ObjectListView.page to show the list of work order objects.
 * We are filtering out assembly objects because they are currently not supported on the client. They are supported by the backend AddOn pack only right now.
 */
export default function WorkOrderObjectListQueryOptions(context) {
    let orderby = '$orderby=ObjectListCounter';
    let expand = '$expand=Equipment_Nav,Equipment_Nav/FunctionalLocation,Equipment_Nav/SerialNumber,Equipment_Nav/SerialNumber/Material,' +
        'FuncLoc_Nav,Material_Nav,WOOperation_Nav,' +
        'NotifHeader_Nav,NotifHeader_Nav/Equipment,NotifHeader_Nav/Equipment/FunctionalLocation,' +
        'NotifHeader_Nav/FunctionalLocation,NotifHeader_Nav/Equipment/SerialNumber,NotifHeader_Nav/Equipment/SerialNumber/Material';
    
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        orderby = '$orderby=Counter';
        expand = '$expand=Equipment_Nav,Equipment_Nav/FunctionalLocation,FuncLoc_Nav,Material_Nav,S4ServiceItem_Nav';
    }

    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        orderby = '$orderby=Counter';
        expand = '$expand=MyEquipment_Nav,MyEquipment_Nav/FunctionalLocation,MyFunctionalLocation_Nav,Material_Nav,S4ServiceOrder_Nav';
    }

    let queryOptions = expand + '&' + orderby;
    return queryOptions;
}
