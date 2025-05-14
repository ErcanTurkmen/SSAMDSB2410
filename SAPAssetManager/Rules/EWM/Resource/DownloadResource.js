import libCom from '../../Common/Library/CommonLibrary';
import ApplicationOnSync from '../../ApplicationEvents/ApplicationOnSync';
import { DocumentTypes,EWMType } from '../Common/EWMLibrary';
export default function DownloadResource(context) {

    return Promise.all([
        context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseOrders', [], ''),
        context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], ''),
    ])
        .then(([orders, tasks]) => Array.from(orders.concat(Array.from(tasks._array))))
        .then(documents => DownloadDoc(context, documents));
}

function DownloadDoc(context, documents) {

    return documents.reduce((prevCreatePromise, currentItem) => {
        return prevCreatePromise.then(() => {
            let type = currentItem['@odata.type'].substring('#sap_mobile.'.length);
            let objectId = '';
            let objectType = '';
            if (type === EWMType.WarehouseOrder) {
                objectId = `${currentItem.WarehouseNo}${currentItem.WarehouseOrder}`;
                objectType = DocumentTypes.WarehouseOrder;
            } else if (type === EWMType.WarehouseTask) {
                objectId = `${currentItem.WarehouseNo}${currentItem.WarehouseTask}`;
                objectType = DocumentTypes.WarehouseTask;
            }
            libCom.setStateVariable(context, 'ObjectId', objectId);
            libCom.setStateVariable(context, 'ObjectType', objectType);
            libCom.setStateVariable(context, 'Action', 'D');
            return context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/OnDemandObjectCreate.action');
        });
    }, Promise.resolve()).then(() => {
        ApplicationOnSync(context);
        return context.executeAction('/SAPAssetManager/Actions/EWM/OverviewPage/OverviewPageNav.action');
    });
}
