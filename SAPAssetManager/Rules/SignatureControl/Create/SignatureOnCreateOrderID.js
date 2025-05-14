import getParentBinding from '../SignatureControlParentBinding';

export default function SignatureOnCreateOrderID(clientAPI) {
    let object = getParentBinding(clientAPI);
    let value = object['@odata.readLink'];

    if (object['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        if (object.ObjectID && object.ObjectID.includes('LOCAL')) {
            value += ':ObjectID';
            return  '<' + value + '>';
        } else {
            return object.ObjectID;
        }
    }

    if (object.OrderId && object.OrderId.includes('LOCAL')) {
        value += ':OrderId';
        return  '<' + value + '>';
    } else {
        return object.OrderId;
    }

}
