import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function ConfirmationOrderObjectType(clientAPI) {
    return S4ServiceLibrary.getServiceConfirmationObjectType(clientAPI);
}
