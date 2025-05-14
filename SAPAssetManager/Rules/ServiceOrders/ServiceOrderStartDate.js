import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function ServiceOrderStartDate(context) {
    const binding = context.binding;
    const serviceContractType = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/ServiceContract.global').getValue();
    let startDate = binding.ContractDateFrom || binding.ContractStartDate;

    if (!libVal.evalIsEmpty(startDate)) {
        let odataDate = new OffsetODataDate(context, startDate);
        if (binding['@odata.type'] === serviceContractType) {
            return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
        }
        return context.formatDate(odataDate.date());
    } else {
        return '-';
    } 
}
