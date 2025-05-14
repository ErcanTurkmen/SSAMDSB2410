import libCommon from '../../Common/Library/CommonLibrary';
import ApplyFilterAndSave from '../../Filter/ApplyFilterAndSave';

export default async function InventorySearchFilterDoneWrapper(context) {
    libCommon.setStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED', true); //Set state variable to handle list count logic during filter
    await ApplyFilterAndSave(context);
}
