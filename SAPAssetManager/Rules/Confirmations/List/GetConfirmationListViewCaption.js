import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Get count of available confirmations
* @param {IClientAPI} clientAPI
*/
export default function GetConfirmationListViewCaption(context, setCaption) {
    let query = '';

    if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isInitialFilterNeeded)) {
        query = S4ServiceLibrary.getConfirmationFilters(context);
    }

    return S4ServiceLibrary.getListCountCaption(
        context,
        'S4ServiceConfirmations',
        '',
        query,
        'confirmations_count',
        'confirmations_count_x_x',
    ).then(caption => {
        return setCaption ? context.setCaption(caption) : caption;
    });
}
