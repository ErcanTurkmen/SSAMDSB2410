import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetPlantName from '../PurchaseOrder/GetPlantName';
import GetStorageLocation from './GetStorageLocation';
import GetBulkUpdatePlantName from './BulkUpdate/GetPlantName';
import GetBulkUpdateStorageLocation from './BulkUpdate/GetStorageLocation';

export default async function IssueOrReceiptSignatureWatermark(context) {
    return [
        `User: ${GetUserId(context)}`,
        `Plant/StorageLocation: ${await GetPlantStorageLocation(context)}`,
        `Reference Document: ${GetReferenceDocument(context)}`,
    ].join('\n');
}

function GetUserId(context) {

    let signatory = CommonLibrary.getStateVariable(context, 'GoodsRecipientSignatory') || context.binding?.GoodsRecipient;
    if (signatory) {
        CommonLibrary.removeStateVariable(context, 'GoodsRecipientSignatory');
        CommonLibrary.removeStateVariable(context, 'SGoodsRecipient');
        return signatory;
    } else {
        return CommonLibrary.getSapUserName(context);
    }
            
}

async function GetPlantStorageLocation(context) {
    const watermarkPlant = CommonLibrary.getStateVariable(context, 'WatermarkPlant');
    const watermarkStorageLocation = CommonLibrary.getStateVariable(context, 'WatermarkStorageLocation');

    if (watermarkPlant || watermarkStorageLocation) {
        return Promise.resolve(`${watermarkPlant}/${watermarkStorageLocation}`);
    } else {
        let plant = GetPlantName(context,context.binding) || await GetBulkUpdatePlantName(context);
        let storageLocation = GetStorageLocation(context) || await GetBulkUpdateStorageLocation(context);
        return Promise.resolve(`${plant}/${storageLocation}`);
    }   
}

function GetReferenceDocument(context) {
    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            if (context.binding.PurchaseOrderItem_Nav) {
                return context.binding.PurchaseOrderNumber;
            } else if (context.binding.StockTransportOrderItem_Nav) {
                return context.binding.StockTransportOrderId;
            } else if (context.binding.ReservationItem_Nav) {
                return context.binding.ReservationNumber;
            }
        }
        if (type === 'PurchaseOrderItem' || type === 'PurchaseOrderHeader') {
            return context.binding.PurchaseOrderId;
        } else if (type === 'StockTransportOrderItem' || type === 'StockTransportOrderHeader') {
            return context.binding.StockTransportOrderId;
        } else if (type === 'ReservationItem' || type === 'ReservationHeader') {
            return context.binding.ReservationNum;
        } else if (type === 'ProductionOrderComponent' || type === 'ProductionOrderItem' || type === 'ProductionOrderHeader') {
            return context.binding.OrderId;
        }
    }
    return 'ADHOC';
}
