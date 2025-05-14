import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* See all available functional locations in one label
* @param {IClientAPI} context
*/
export default function GetConfirmationDetailsFLocs(context) {
    return S4ServiceLibrary.getDataFromRefObjects(context, 'MyFunctionalLocation_Nav');
}
