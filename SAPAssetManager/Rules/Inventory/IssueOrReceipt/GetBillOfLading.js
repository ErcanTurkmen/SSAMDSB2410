export default function GetBillOfLading(context) {

    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem') {
            return context.binding.AssociatedMaterialDoc.BillOfLading;
        } else if (type === 'MaterialDocument') {
            return context.binding.BillOfLading;
        }

        if (context.binding.TempHeader_BillOfLading) {
            return context.binding.TempHeader_BillOfLading;
        }
    }
    return ''; //If not editing an existing local receipt item, then default to empty
}
