
export default function RedrawS4ItemsEDTPage(context, sectionName) {
    const sectionedTable = context.getControls()[0];
    const edtSection = sectionName ? sectionedTable.getSection(sectionName) : sectionedTable.getSections()[0];
    const edtExtension = edtSection.getExtension();
    if (edtExtension) {
        edtExtension.getParams().Target.EntitySet = '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/EDT/ServiceItemTableEntitySet.js';
        edtExtension.getParams().Target.QueryOptions = '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/EDT/ServiceItemTableQueryOptions.js';
        edtSection.redraw(true);
    }
}
