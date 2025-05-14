import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import Logger from '../../../Log/Logger';

export default function InspectionLotSetUsageInitialValue(context) {
    let pageName = libCom.getStateVariable(context, 'FDCPreviousPage');
    let actionBinding = '';
    try {
        actionBinding = context.evaluateTargetPathForAPI('#Page:' + pageName).getClientData().ActionBinding;
    } catch (error) {
        //exception when the pageName does not exists
        Logger.error('pageName does not exists ' + error);
    }
    if (Object.prototype.hasOwnProperty.call(context.binding,'InspectionCode_Nav') && !libVal.evalIsEmpty(context.binding.InspectionCode_Nav)) {
        context.getPageProxy().getClientData().InspectionCode = context.binding.InspectionCode_Nav;
        return context.binding.InspectionCode_Nav['@odata.readLink'];
    } else if (context.binding['@odata.type'] === '#sap_mobile.EAMChecklistLink' || (actionBinding && actionBinding['@odata.type'] === '#sap_mobile.EAMChecklistLink')) {
        let binding = context.binding;
        if (actionBinding) {
            binding = actionBinding;
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', binding.InspectionLot_Nav['@odata.readLink'], [], '$expand=InspectionCode_Nav').then((inspectionLot) => {
            context.getPageProxy().getClientData().InspectionCode = inspectionLot.getItem(0).InspectionCode_Nav;
            return inspectionLot.getItem(0).InspectionCode_Nav['@odata.readLink'];
        });
    }
}
