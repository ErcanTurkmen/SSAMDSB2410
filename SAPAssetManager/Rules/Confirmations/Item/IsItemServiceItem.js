import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* Checking if item is service item
* @param {IClientAPI} context
*/
export default function IsItemServiceItem(context) {
    let binding = context.binding;
    if (binding) {
        return S4ServiceLibrary.checkIfItemIsServiceItem(context, binding);
    }
    return false;
}
