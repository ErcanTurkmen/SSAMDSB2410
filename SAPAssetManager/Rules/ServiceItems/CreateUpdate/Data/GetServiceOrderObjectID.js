import libCommon from '../../../Common/Library/CommonLibrary';
import ServiceOrderLocalID from '../../../ServiceOrders/CreateUpdate/ServiceOrderLocalID';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function GetServiceOrderObjectID(context) {
    if (S4ServiceLibrary.isOnSOChangeset(context)) {
        return ServiceOrderLocalID(context);
    }

    const objectID = libCommon.getTargetPathValue(context, '#Page:CreateUpdateServiceItemScreen/#Control:ServiceOrderLstPkr');
    return libCommon.getControlValue(objectID);
}
