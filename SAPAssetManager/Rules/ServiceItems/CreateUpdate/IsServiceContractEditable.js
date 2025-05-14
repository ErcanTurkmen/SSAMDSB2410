import IsOnCreate from '../../Common/IsOnCreate';
import ServiceOrderSalesOrgValue from '../../ServiceOrders/CreateUpdate/ServiceOrderSalesOrgValue';
import IsItemCreateFromServiceItemsList from './IsItemCreateFromServiceItemsList';

export default function IsServiceContractEditable(clientAPI) {
    if (IsOnCreate(clientAPI)) {
        if (!IsItemCreateFromServiceItemsList(clientAPI)) {
            return ServiceOrderSalesOrgValue(clientAPI).then(res => !!res);
        } else {
            return !!clientAPI.binding && !!clientAPI.binding.ObjectID;
        }
    }
    return false;
}
