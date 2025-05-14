import {GetOpenItemsQuery} from './BulkUpdateLibrary';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

// To allow goods issue all only if there is atleast 1 item that is not completed and open qty is greater tha zero
export default function BulkGoodsIssueIsAllowed(context, bindingObject) {
    let query;
    let target;
    let openItemsQuery;
    const binding = bindingObject || context.binding;
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'ReservationHeader') {
        openItemsQuery = GetOpenItemsQuery('ReservationItems');
        query = `$filter=ReservationNum eq '${binding.ReservationNum}' and ${openItemsQuery}`;
        target = 'ReservationItems';
    } else if (type === 'StockTransportOrderHeader') {
        if (allowIssueForSTO(binding)) {
            openItemsQuery = GetOpenItemsQuery('StockTransportOrderItems');
            query = `$filter=(StockTransportOrderId eq '${binding.StockTransportOrderId}') and ${openItemsQuery}`;
            target = 'StockTransportOrderItems';
        }
    } else if (type === 'ProductionOrderHeader') {
        openItemsQuery = GetOpenItemsQuery('ProductionOrderComponents');
        query = `$filter=(OrderId eq '${binding.OrderId}') and ${openItemsQuery}`;
        target = 'ProductionOrderComponents';
    }
    if (query && target) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', target, query).then(function(count) {
            return count > 0;
        });
    } 
    return 0;
}

function allowIssueForSTO(stoHeader) {
    let plant = CommonLibrary.getDefaultUserParam('USER_PARAM.WRK');
    return plant === stoHeader.SupplyingPlant;
}
