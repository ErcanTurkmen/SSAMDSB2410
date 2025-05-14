/**
* This function calls the failed action when the scan fails in goods movement screen
* @param {IClientAPI} context
*/
export default function BarcodeScanFailure(context) {
    context.binding.temp_message = '$(L, scan_failed)';
    context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/ScanFailedMessage.action');
}
