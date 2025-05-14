import IsBusinessObjectChangeable from '../../Common/DetailsPageToolbar/IsBusinessObjectChangeable';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

/**
* returns true if confirmation is in Open status
* @param {IClientAPI} context
*/
export default function IsConfirmationCompleted(context) {
    // we can't change mobile status of an object if we are not on the right level assignment, so avoid doing these steps
    if (IsBusinessObjectChangeable(context)) {
        return S4ServiceLibrary.isServiceObjectCompleted(context, context.binding).then(isCompleted => !isCompleted);
    }
    return false;
}
