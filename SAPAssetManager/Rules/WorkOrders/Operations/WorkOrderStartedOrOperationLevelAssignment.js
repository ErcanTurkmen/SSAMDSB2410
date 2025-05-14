import CommonLibrary from '../../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function WorkOrderStartedOrOperationLevelAssignment(context) {
    if (MobileStatusLibrary.isHeaderStatusChangeable(context)) { //if it's header level assignment then check to see if the workorder is started
        const binding = context.getPageProxy().binding;
        const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

        return binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader' && MobileStatusLibrary.getMobileStatus(binding, context) === STARTED;
    } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) { //operation level assignment so make it visible
        return true;
    } //disable for any other assignments
    return false;
}
