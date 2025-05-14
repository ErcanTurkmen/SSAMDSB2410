/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionLotSetUsageValuationReadLink(context) {
    if (context.getClientData().InspectionCode && context.getClientData().InspectionCode.InspValuation_Nav) {
        return context.getClientData().InspectionCode.InspValuation_Nav['@odata.readLink'];
    } else if (!context.getClientData().InspectionCode.InspValuation_Nav) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.getClientData().InspectionCode['@odata.readLink'], [], '$expand=InspValuation_Nav').then((inspectionCode) => {
            return inspectionCode.getItem(0).InspValuation_Nav['@odata.readLink'];
        });
    }

}
