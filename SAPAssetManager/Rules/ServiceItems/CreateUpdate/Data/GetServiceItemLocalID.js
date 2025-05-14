import GenerateLocalID from '../../../Common/GenerateLocalID';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../../ServiceOrders/S4ServiceLibrary';

export default function GetServiceItemLocalID(context) {
    if (S4ServiceLibrary.isOnSOChangeset(context)) {
        let localId = '000010';
        CommonLibrary.setStateVariable(context, 'lastLocalItemId', localId);
        return localId;
    }

    if (context.binding?.ItemNo && !CommonLibrary.IsOnCreate(context)) { //Editing an existing item
        return context.binding.ItemNo;
    }

    let orderLstPkrValue  = CommonLibrary.getListPickerValue(CommonLibrary.getTargetPathValue(context, '#Control:ServiceOrderLstPkr/#Value'));
    return GenerateLocalID(context, 'S4ServiceItems', 'ItemNo', '000000', `$filter=ObjectID eq '${orderLstPkrValue}'`, '', 'ItemNo', 9).then(id => {
        return id;
    });
}
