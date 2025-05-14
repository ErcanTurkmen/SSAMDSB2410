
import libCom from '../Common/Library/CommonLibrary';
import ServiceOrderObjectType from '../ServiceOrders/ServiceOrderObjectType';

export default function MobileStatusLocalServiceOrderReadLink(context) {
    //return the local service order id state variable set from ServiceOrderCreate.action
    let localServiceOrderID = libCom.getStateVariable(context, 'LocalId');
    const objectType = ServiceOrderObjectType(context);
    return `S4ServiceOrders(ObjectID='${localServiceOrderID}',ObjectType='${objectType}')`;
}
