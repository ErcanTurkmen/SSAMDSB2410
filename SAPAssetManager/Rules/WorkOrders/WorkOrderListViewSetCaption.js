import libCommon from '../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWo} from './WorkOrderLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';
import libPersona from '../Persona/PersonaLibrary';
import getWorkOrdersFSMQueryOption from './ListView/WorkOrdersFSMQueryOption';
import MyWorkSectionFilterQuery from '../OverviewPage/MyWorkSection/MyWorkSectionFilterQuery';

export default function WorkOrderListViewSetCaption(context) {
    let queryOption;
    let totalQueryOption = '';
    let orderTypesPromise;
    let isFST = libPersona.isFieldServiceTechnician(context);

    let quickFilters = decodeURIComponent(libCommon.getQueryOptionFromFilter(context) || '');
    let filterText = libCommon.getStateVariable(context, 'WORKORDER_FILTER');
    if (quickFilters) {
        filterText = quickFilters;
        libCommon.removeStateVariable(context, 'WORKORDER_FILTER');
    }

    if (isFST) {
        orderTypesPromise = getWorkOrdersFSMQueryOption(context);
    } else {
        orderTypesPromise = Promise.resolve();
    }

    return orderTypesPromise.then(async types => {
        if (libCommon.isDefined(context.binding)) {
            if (libCommon.isDefined(context.binding.isHighPriorityList)) {
                queryOption = libWo.getFilterForHighPriorityWorkorders(context);
            } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isSupervisorWorkOrdersList)) {
                queryOption = libSuper.getFilterForWOPendingReview(context, false);
            } else if ((libSuper.isSupervisorFeatureEnabled(context)) && libCommon.isDefined(context.binding.isTechnicianWorkOrdersList)) {
                queryOption = libSuper.getFilterForSubmittedWO(context, false);
            }
        }
        if (queryOption) { //Handle MDK filters
            let customFilter = libCommon.getStateVariable(context, 'CustomListFilter');
            if (customFilter) {
                if (filterText && filterText !== '$filter=') { //Combine mdk filter with custom filter
                    queryOption = queryOption.replace('$filter=' + customFilter,''); //Remove current custom filter
                    queryOption += filterText + ' and ' + customFilter; //Inject mdk filter combined with custom filter
                }
            } else {
                if (filterText !== '$filter=') {
                    queryOption += '&' + filterText; //Inject mdk filter only
                }
            }
        } else {
            if (filterText !== '$filter=') {
                queryOption = filterText; //Inject mdk filter only
            }
        }

        let additionalFilter = '';

        if (isFST) {
            additionalFilter = types;
        }

        const countFilter = libWo.getWorkOrdersFilterByAssgnTypeOrWCM(context);

        if (countFilter) {
            additionalFilter = additionalFilter ? `${additionalFilter} and ${countFilter}` : countFilter;
        }

        if (additionalFilter) {
            totalQueryOption = '$filter=' + additionalFilter;

            if (queryOption && queryOption.indexOf('$filter=') !== -1) {
                queryOption += ' and ' + additionalFilter;
            } else {
                queryOption = '$filter=' + additionalFilter;
            }
        }

        if (libCommon.getStateVariable(context, 'MyWorkOrderListView')) {
            queryOption = await MyWorkSectionFilterQuery(context);
        }

        let params = [];
        let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', totalQueryOption);
        let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', queryOption);

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

            return context.setCaption(caption);
        });
    });
}
