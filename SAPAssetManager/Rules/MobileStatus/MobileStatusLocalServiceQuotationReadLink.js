
import libCom from '../Common/Library/CommonLibrary';
import ServiceOrderObjectType from '../ServiceOrders/ServiceOrderObjectType';

export default function MobileStatusLocalServiceQuotationReadLink(context) {
    //return the local service quotation id state variable set from ServiceQuotationCreate.action
    let localServiceQuotationID = libCom.getStateVariable(context, 'LocalId');
    const objectType = ServiceOrderObjectType(context);
    return `S4ServiceQuotations(ObjectID='${localServiceQuotationID}',ObjectType='${objectType}')`;
}
