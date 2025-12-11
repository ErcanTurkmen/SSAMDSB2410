import ZOperationMultiSelectVisibleForOrderTypes from './ZOperationMultiSelectVisibleForOrderTypes';
export default function ZEnableOperationMultiSelect(context) {
	if (context.binding?.['@odata.type'] === "#sap_mobile.MyWorkOrderHeader" && ZOperationMultiSelectVisibleForOrderTypes(context.binding)) {
		return true;
	}
	else {
		return false;
	}
}