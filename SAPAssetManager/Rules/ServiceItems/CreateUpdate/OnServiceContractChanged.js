import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceOrderLocalID from '../../ServiceOrders/CreateUpdate/ServiceOrderLocalID';
import UpdateContractItemsComponent from '../UpdateContractItemsComponent';
import IsItemCreateFromServiceItemsList from './IsItemCreateFromServiceItemsList';

/**
* Describe this function...
* @param {IClientAPI} control
*/
export default async function OnServiceContractChanged(control) {
    let serviceOrderId;
    if (!IsItemCreateFromServiceItemsList(control)) {
        serviceOrderId = ServiceOrderLocalID(control);
    }
    return UpdateContractItemsComponent(control, serviceOrderId, CommonLibrary.getControlValue(control));
}
