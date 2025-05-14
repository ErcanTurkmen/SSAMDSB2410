import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* See all available products in one label
* @param {IClientAPI} context
*/
export default function GetConfirmationDetailsProducts(context) {
    return S4ServiceLibrary.getDataFromRefObjects(context, 'Material_Nav');
}
