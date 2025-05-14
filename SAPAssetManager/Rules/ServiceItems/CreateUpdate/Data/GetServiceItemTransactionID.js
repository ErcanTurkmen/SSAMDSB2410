import GenerateLocalID from '../../../Common/GenerateLocalID';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ServiceOrderLocalID from '../../../ServiceOrders/CreateUpdate/ServiceOrderLocalID';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function GetServiceItemTransactionID(context) {
    if (S4ServiceLibrary.isOnSOChangeset(context)) {
        return ServiceOrderLocalID(context);
    }

    if (context.binding && context.binding.ItemNo) {
        return context.binding.ItemNo;
    }

    let orderLstPkrValue  = CommonLibrary.getListPickerValue(CommonLibrary.getTargetPathValue(context, '#Control:ServiceOrderLstPkr/#Value'));
    return GenerateLocalID(context, 'S4ServiceItems', 'ItemNo', '000000', `$filter=ObjectID eq '${orderLstPkrValue}'`, '').then(id => {
        return id;
    });
}
