
import libCom from '../Common/Library/CommonLibrary';
import ServiceOrderObjectType from '../ServiceOrders/ServiceOrderObjectType';

export default function MobileStatusLocalServiceItemReadLink(context) {
    const lastLocalItemId = libCom.getStateVariable(context, 'lastLocalItemId');
    const localServiceOrderID = libCom.getStateVariable(context, 'LocalId');
    const objectType = ServiceOrderObjectType(context);
    return `S4ServiceItems(ObjectID='${localServiceOrderID}',ItemNo='${lastLocalItemId}',ObjectType='${objectType}')`;
}

