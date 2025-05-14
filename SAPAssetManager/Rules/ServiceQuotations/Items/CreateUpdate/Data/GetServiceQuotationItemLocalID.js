import GenerateLocalID from '../../../../Common/GenerateLocalID';
import CommonLibrary from '../../../../Common/Library/CommonLibrary';

export default function GetServiceQuotationItemLocalID(context) {
    if (context.binding?.ItemNo && !CommonLibrary.IsOnCreate(context)) {
        return context.binding.ItemNo;
    }

    let quotationLstPkrValue = CommonLibrary.getListPickerValue(CommonLibrary.getTargetPathValue(context, '#Control:ServiceQuotationLstPkr/#Value'));
    return GenerateLocalID(context, 'S4ServiceQuotationItems', 'ItemNo', '000000', `$filter=ObjectID eq '${quotationLstPkrValue}'`, '').then(id => {
        return id;
    });
}
