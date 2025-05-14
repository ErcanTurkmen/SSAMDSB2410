import libCom from '../../../Common/Library/CommonLibrary';
import ServiceOrderLocalID from '../../../ServiceOrders/CreateUpdate/ServiceOrderLocalID';
import libS4 from '../../../ServiceOrders/S4ServiceLibrary';

export default function GetOrderObjectID(context) {
    if (libS4.isOnSOChangeset(context)) {
        return ServiceOrderLocalID(context);
    } else {
        return libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:ServiceOrderLstPkr/#Value'));
    }
}
