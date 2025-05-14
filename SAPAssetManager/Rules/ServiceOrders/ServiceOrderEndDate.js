import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function ServiceOrderEndDate(context) {
    const binding = context.binding;
    const serviceContractType = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/ServiceContract.global').getValue();
    let endDate = binding.ContractDateTo || binding.ContractEndDate;

    if (!libVal.evalIsEmpty(endDate)) {
        let odataDate = new OffsetODataDate(context, endDate);
        if (binding['@odata.type'] === serviceContractType) {
            return context.formatDate(odataDate.date(), '', '', {'format': 'short'});
        }
        return context.formatDate(odataDate.date());
    } else {
        return '-';
    } 
}
