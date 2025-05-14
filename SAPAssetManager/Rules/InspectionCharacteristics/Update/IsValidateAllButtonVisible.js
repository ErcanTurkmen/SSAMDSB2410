/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsValidateAllButtonVisible(context) {
    let sectionsBindings = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
    let count = 0;
    if (sectionsBindings && sectionsBindings.length > 0) {
        for (let i=0; i < sectionsBindings.length; i++) {
            if (count > 1) {
                return true;
            }
            if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings[i]['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                count++;
            }
        }
    }
    return false;
}
