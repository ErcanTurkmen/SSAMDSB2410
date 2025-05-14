import libCom from '../../../Common/Library/CommonLibrary';


/**
* Retrieves the Inspection Lot ReadLink
* @param {IClientAPI} context
*/
export default function InspectionLotReadLink(context) {
    let readlink = '';
    try {
        let pageName = libCom.getStateVariable(context, 'FDCPreviousPage');
        let binding = context.evaluateTargetPathForAPI('#Page:' + pageName).binding;
        let actionBinding = context.evaluateTargetPathForAPI('#Page:' + pageName).getClientData().ActionBinding;
        let lot = '';
        if (binding && binding.InspectionLot) {
            lot = binding.InspectionLot;
        }
        if (actionBinding && actionBinding['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
            lot = actionBinding.InspectionLot;
        }
        if (lot) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionLots', [], `$filter=InspectionLot eq '${lot}'`).then((inspectionLot) => {
                return inspectionLot.getItem(0)['@odata.readLink'];
            });
        }
    } catch (exc) {
        // Someone wrote buggy code above and I have no idea how to fix it, so everything else is going in this catch block.
        let binding = context.binding;
        if (binding['@odata.type'] === '#sap_mobile.InspectionLot') {
            return binding['@odata.readLink'];
        } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            readlink = binding['@odata.readLink'];
        } else if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            readlink = binding.WOHeader['@odata.readLink'];
        }
        if (readlink) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', readlink, [], '$expand=InspectionLot_Nav').then((workOrderResult) => {
                return workOrderResult.getItem(0).InspectionLot_Nav[0]['@odata.readLink'];
            });
        }
    }

    return '';
}
