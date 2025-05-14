import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* get confirmation status label based on two fields
* @param {IClientAPI} context
*/
export default function GetConfirmationDetailsStatusView(context) {
    return S4ServiceLibrary.getConfirmationDetailsData(context, 'Status');
}
