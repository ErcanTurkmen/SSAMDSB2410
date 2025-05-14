import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function IsNotTravelExpenceMode(clientAPI) {
    return !(S4ServiceLibrary.isViewModeTravelExpence(clientAPI));
}
