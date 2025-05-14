import libCommon from '../../../Common/Library/CommonLibrary';
import { SubOperationControlLibrary as libOperationControl} from '../../../SubOperations/SubOperationLibrary';

/**
 * Operation's TransactionID is parent workorder's OrderId
 * @param {*} context 
 */
export default function SubOperationTransactionID(context) {
    const onCreate = libCommon.IsOnCreate(context);
    const binding = context.binding || {};

    if (onCreate) {
        if (libCommon.isDefined(binding.OrderId)) {
            return binding.OrderId;
        } else {
            const workOrderReadLink = libOperationControl.getWorkOrder(context);
            if (libCommon.isDefined(workOrderReadLink)) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', workOrderReadLink, [], '').then(function(result) {
                    return result.length ? result.getItem(0).OrderId : '';
                });
            }
        }
    }

    return libCommon.getEntityProperty(context, binding['@odata.readLink'] + '/WorkOrderOperation/WOHeader', 'OrderId');
}
