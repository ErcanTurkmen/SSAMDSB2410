/**
 * Reload the current header object's status and redraw the header section to refresh the status on screen
 * @param {*} context 
 * @returns 
 */
export default function RedrawDetailsHeader(context) {
    if (context.binding) {
        const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        const { filter, field, process } = getHeaderValues(type);

        if (process) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], filter).then(results => {
                if (results && results.length > 0) {
                    context.binding[field] = results.getItem(0)[field];
                }
                try {                    
                    context.getControl('SectionedTable').getSection('SectionObjectHeader').redraw(true);
                } catch (err) {
                    return false;
                }
                return true;
            });
        }
    }
    return Promise.resolve(true);
}

function getHeaderValues(type) {
    let filter, field;
    let process = false;
    switch (type) {
        case 'ReservationHeader':
        case 'PurchaseOrderHeader':
        case 'StockTransportOrderHeader':
            filter = '$select=DocumentStatus';
            field = 'DocumentStatus';
            process = true;
            break;
        case 'InboundDelivery':
        case 'OutboundDelivery':
            filter = '$select=GoodsMvtStatus';
            field = 'GoodsMvtStatus';
            process = true;
            break;
    }
    return { filter, field, process };
}
