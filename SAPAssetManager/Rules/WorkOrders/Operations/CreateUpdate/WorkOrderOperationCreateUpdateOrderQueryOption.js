import libVal from '../../../Common/Library/ValidationLibrary';
import libPersona from '../../../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from '../../ListView/WorkOrdersFSMQueryOption';
import { WorkOrderLibrary as libWO } from '../../WorkOrderLibrary';
import IsPhaseModelEnabled from '../../../Common/IsPhaseModelEnabled';
import libSupervisor from '../../../Supervisor/SupervisorLibrary';

export default function WorkOrderOperationCreateUpdateOrderQueryOption(context) {
    let queryOptions;

    return getPhaseOrderTypesExcludeFilter(context).then((phaseFilter) => {
        if (libPersona.isFieldServiceTechnician(context)) {
            return WorkOrdersFSMQueryOption(context, '', true).then(fsmTypes => {
                queryOptions = '$orderby=OrderId asc';
                if (!libVal.evalIsEmpty(fsmTypes)) {
                    queryOptions += `&$filter=${fsmTypes}`;
                } else {
                    if (phaseFilter) {
                        queryOptions += `&$filter=${phaseFilter}`;
                    }
                }
                return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
            });
        } else {
            queryOptions = '$orderby=OrderId asc';
            if (phaseFilter) {
                queryOptions += `&$filter=${phaseFilter}`;
            }
            return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
        }
    });
}

/**
 * Get the filter string used to exclude phase model enabled order types
 * Phase enabled orders cannot be used to add operations from client
 * @param {*} context 
 * @returns 
 */
function getPhaseOrderTypesExcludeFilter(context) {
    if (IsPhaseModelEnabled(context)) {
        return libSupervisor.isUserTechnician(context).then(isTechnician => {
            if (isTechnician) {
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['OrderType'], "$filter=PhaseModelActive eq 'X'").then(types => {
                    if (types?.length > 0) {
                        const typesQueryStrings = types.map(type => {
                            return `OrderType ne '${type.OrderType}'`;
                        });
                        return `(${typesQueryStrings.join(' and ')})`;
                    }
                    return '';
                });
            }
            return Promise.resolve(false);
        });
    }
    return Promise.resolve(false);
}
