import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* sum up all available values from all confirmation items to get a result
* @param {IClientAPI} context
*/
export default function GetConfirmationDetailsNetValue(context) {
    return S4ServiceLibrary.getConfirmationDetailsData(context, 'NetValue');
}
