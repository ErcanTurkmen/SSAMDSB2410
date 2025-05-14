import { PrivateMethodLibrary as libPrivate } from '../../SubOperations/SubOperationLibrary';

export default function WorkOrderSubOperationIsEquipFuncLocAllowed(pageProxy) {
    return libPrivate._getParentWorkOrder(pageProxy).then(parentWorkOrder => {
        if (parentWorkOrder) {
            return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${parentWorkOrder.OrderType}' and PlanningPlant eq '${parentWorkOrder.PlanningPlant}'`).then(function(myOrderTypes) {
                if (myOrderTypes && myOrderTypes.length > 0) {
                    let record = myOrderTypes.getItem(0);
                    return record.ObjectListAssignment === '';
                }
                return false;
            });
        } else {
            return true;
        }
    });
}
