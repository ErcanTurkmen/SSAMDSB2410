import libVal from '../../Common/Library/ValidationLibrary';
import libPersona from '../../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function MileageAddEditOrderQueryOptions(context) {
    if (libPersona.isFieldServiceTechnician(context)) {
        return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
            let queryOptions = '';
            if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                queryOptions = '$filter=' + fsmQueryOptions;
            }
            
            return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
        });
    } else {
        return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context);
    }
}
