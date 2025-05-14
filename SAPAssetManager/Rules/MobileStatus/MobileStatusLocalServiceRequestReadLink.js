import libCom from '../Common/Library/CommonLibrary';
import ServiceRequestObjectType from '../ServiceOrders/ServiceRequestObjectType';

export default function MobileStatusLocalServiceRequestReadLink(context) {
    //return the local service order id state variable set from ServiceOrderCreate.action
    let localServiceRequestID = libCom.getStateVariable(context, 'LocalId');
    const objectType = ServiceRequestObjectType(context);
    return `S4ServiceRequests(ObjectID='${localServiceRequestID}',ObjectType='${objectType}')`;
}
