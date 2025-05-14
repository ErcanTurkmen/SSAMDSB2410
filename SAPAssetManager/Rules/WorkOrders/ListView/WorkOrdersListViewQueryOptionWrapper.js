import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from './WorkOrdersFSMQueryOption';
import WorkOrdersListViewQueryOption from './WorkOrdersListViewQueryOption';
import { WorkOrderLibrary } from '../WorkOrderLibrary';
import WorkOrderListViewSetCaption from '../WorkOrderListViewSetCaption';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/** @param {IControlProxy} clientAPI */
export default function WorkOrdersListViewQueryOptionWrapper(clientAPI) {
    if (CommonLibrary.getPageName(clientAPI) === 'WorkOrdersListViewPage') {
        WorkOrderListViewSetCaption(clientAPI.getPageProxy());
    }

    if (PersonaLibrary.isFieldServiceTechnician(clientAPI)) {
        return WorkOrdersFSMQueryOption(clientAPI).then(fsmQueryOptions => {
            let queryOptions = WorkOrdersListViewQueryOption(clientAPI);
            if (!ValidationLibrary.evalIsEmpty(fsmQueryOptions)) {
                queryOptions.filter(fsmQueryOptions);
            }
            return queryOptions;
        });
    } else {
        const queryBuilder = WorkOrdersListViewQueryOption(clientAPI);

        if (PersonaLibrary.isWCMOperator(clientAPI)) {
            const filterWCM = WorkOrderLibrary.getWCMWorkOrdersFilter(clientAPI);
            if (queryBuilder.hasFilter) {
                queryBuilder.filter().and(filterWCM);
            } else {
                queryBuilder.filter(filterWCM);
            }
        }

        return queryBuilder;
    }
}
