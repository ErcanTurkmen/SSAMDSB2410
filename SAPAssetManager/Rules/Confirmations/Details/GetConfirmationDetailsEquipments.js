import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* See all available equipments in one label
* @param {IClientAPI} context
*/
export default function GetConfirmationDetailsEquipments(context) {
    return S4ServiceLibrary.getDataFromRefObjects(context, 'MyEquipment_Nav');
}
