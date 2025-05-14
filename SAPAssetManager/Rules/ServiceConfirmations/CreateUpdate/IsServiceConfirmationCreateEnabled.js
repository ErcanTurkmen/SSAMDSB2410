import S4ErrorsLibrary from '../../S4Errors/S4ErrorsLibrary';
import IsServiceOrderReleased from '../../ServiceOrders/Status/IsServiceOrderReleased';

export default function IsServiceConfirmationCreateEnabled(context) {
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        if (S4ErrorsLibrary.isS4ObjectHasErrorsInBinding(context)) return false;

        return IsServiceOrderReleased(context).then(isReleased => {
            return isReleased; 
        }).catch(function() {
            return true;
        });
    }

    return true;
}
