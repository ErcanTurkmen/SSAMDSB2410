import libMobStatus from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import OperationsEntitySet from '../../WorkOrders/Operations/OperationsEntitySet';
import { OperationConstants } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import sdfIsFeatureEnabled from '../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../Forms/SDF/FormInstanceCount';

export default async function ConfirmAllButtonVisible(context) {
    const binding = context.getPageProxy().binding;
    const filterPlus = libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects') ? '' : " and not substringof('L', OperationNo)"; //Exclude locals if parameter restricts them

    if (binding && binding.Operations && sdfIsFeatureEnabled(context)) {
        let operations = binding.Operations;
        for (let i = 0; i < operations.length; i++) {
            let count = await FormInstanceCount(context, true, operations[i]['@odata.readLink']);
            if (count !== 0) return false;
        }
    }
    
    if (libMobStatus.isHeaderStatusChangeable(context) && (libMobStatus.getMobileStatus(binding, context) === libMobStatus.getMobileStatusValueConstants(context).STARTED)) {
        return !!(await libCommon.getEntitySetCount(context, OperationsEntitySet(context, binding), `$filter=${OperationConstants.notFinallyConfirmedFilter() + filterPlus}`));
    }
    return false;
}
