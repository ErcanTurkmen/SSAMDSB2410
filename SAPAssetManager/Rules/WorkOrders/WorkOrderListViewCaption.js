import libCommon from '../Common/Library/CommonLibrary';
import libPersona from '../Persona/PersonaLibrary';
import { WorkOrderLibrary as libWo } from './WorkOrderLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';
import getFSMQueryOptions from './ListView/WorkOrdersFSMQueryOption';
import MyWorkSectionFilterQuery from '../OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';

export default function WorkOrderListViewCaption(context) {

    const isFST = libPersona.isFieldServiceTechnician(context);
    let queryOption, totalQueryOption = '';
    let orderTypesPromise;
    if (libCommon.isDefined(context.binding) && libCommon.isDefined(context.binding.isHighPriorityList)) {
        queryOption = libWo.getFilterForHighPriorityWorkorders(context);
    } else if (libCommon.isDefined(context.binding) && (libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isSupervisorWorkOrdersList)) {
        queryOption = libSuper.getFilterForWOPendingReview(context, false, true);
    } else if (libCommon.isDefined(context.binding) && (libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isTechnicianWorkOrdersList)) {
        queryOption = libSuper.getFilterForSubmittedWO(context, false);
    } else {
        queryOption = libCommon.getStateVariable(context, 'WORKORDER_FILTER');
        let quickFilters = decodeURIComponent(libCommon.getQueryOptionFromFilter(context) || '');
        if (quickFilters) {
            queryOption = quickFilters;
        }
    }
    if (isFST) {
        orderTypesPromise = getFSMQueryOptions(context);
    } else {
        orderTypesPromise = Promise.resolve();
    }

    return orderTypesPromise.then(async (result) => {
        let additionalFilter = '';

        if (isFST) {
            additionalFilter = result;
        }

        const countFilter = libWo.getWorkOrdersFilterByAssgnTypeOrWCM(context);

        if (countFilter) {
            additionalFilter = additionalFilter ? `${additionalFilter} and ${countFilter}` : countFilter;
        }

        if (additionalFilter) {
            totalQueryOption = '$filter=' + additionalFilter;

            if (queryOption === '$filter=') {
                queryOption += additionalFilter;
            } else {
                queryOption += ' and ' + additionalFilter;
            }
        }

        if (libCommon.getStateVariable(context, 'MyWorkOrderListView')) {
            queryOption = await MyWorkSectionFilterQuery(context);
        }

        let params = [];
        let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', totalQueryOption);
        let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOption);

        return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
            let totalCount = resultsArray[0];
            let count = resultsArray[1];
            let caption = '';

            params.push(count);
            params.push(totalCount);

            if (count === totalCount) {
                caption = isFST ? context.localizeText('service_order_x', [totalCount]) : context.localizeText('work_order_x', [totalCount]);
            } else {
                caption = isFST ? context.localizeText('service_order_x_x', params) : context.localizeText('work_order_x_x', params);
            }

            return caption;
        });
    });
}
