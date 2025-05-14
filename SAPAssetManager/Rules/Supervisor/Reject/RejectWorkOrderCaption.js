import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function RejectWorkOrderCaption(context) {
    
    let businessObject = context.binding;

    if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return businessObject.OrderId + ' - ' + businessObject.OrderDescription;
    } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return context.read('/SAPAssetManager/Services/AssetManager.service', "MyWorkOrderHeaders('" + businessObject.OrderId + "')", ['OrderDescription'], '').then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                return businessObject.OrderId + ' - ' + row.OrderDescription;
            }
            return '';
        });
    } else if (businessObject['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        return businessObject.ObjectID + ' - ' + businessObject.Description;
    } else if (businessObject['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        const objectType = S4ServiceLibrary.getServiceOrderObjectType(context);
        return context.read('/SAPAssetManager/Services/AssetManager.service', `S4ServiceOrders(ObjectID='${businessObject.ObjectID}',ObjectType='${objectType}')`, ['Description'], '').then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                return businessObject.ObjectID + ' - ' + row.Description;
            }
            return '';
        }); 
    }

    return '';
}
