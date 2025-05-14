/**
* This function sets the failure message for the failed scan in goods movement screen
* @param {IClientAPI} context
*/
export default function BarcodeScanFailureMessage(context) {
    return context.binding.temp_message || '';
}
