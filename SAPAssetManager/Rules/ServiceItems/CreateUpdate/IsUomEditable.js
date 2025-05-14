import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function IsUomEditable(clientAPI) {
    return S4ServiceLibrary.isViewModeTravelExpence(clientAPI) || S4ServiceLibrary.isServiceTravelExpenceItem(clientAPI);
}
