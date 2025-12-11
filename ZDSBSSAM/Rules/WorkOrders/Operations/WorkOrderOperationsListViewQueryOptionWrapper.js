import ValidationLibrary from '../../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';
import PersonaLibrary from '../../../../SAPAssetManager/Rules/Persona/PersonaLibrary';
import WorkOrderOperationsFSMQueryOption from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import WorkOrderOperationsListViewQueryOption from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationsListViewQueryOption';
import { OperationConstants } from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationLibrary';
import WorkOrderOperationListViewSetCaption from '../../../../SAPAssetManager/Rules/WorkOrders/Operations/WorkOrderOperationListViewSetCaption';
import CommonLibrary from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default async function WorkOrderOperationsListViewQueryOptionWrapper(context) {
    await WorkOrderOperationListViewSetCaption(context.getPageProxy(), context);

    if (PersonaLibrary.isFieldServiceTechnician(context)) {
        return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
            let queryOptions = WorkOrderOperationsListViewQueryOption(context);
            if (typeof queryOptions === 'string') {
                queryOptions = context.dataQueryBuilder(queryOptions);
            }
            if (!ValidationLibrary.evalIsEmpty(fsmQueryOptions)) {
                queryOptions.filter(fsmQueryOptions);
            }
            setOperationConfirrmQueryOptionsFilter(context, queryOptions);
            return queryOptions;
        });
    } else {
        let queryOptions = WorkOrderOperationsListViewQueryOption(context);
        if (typeof queryOptions === 'string') {
            queryOptions = context.dataQueryBuilder(queryOptions);
        }
        queryOptions.expand('WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav,OperationMobileStatus_Nav/OverallStatusCfg_Nav,NotifHeader_Nav');
        if (PersonaLibrary.isWCMOperator(context)) {
            const filterWCM = OperationConstants.WCMOperationsFilter(context);
            if (filterWCM) {
                if (queryOptions.hasFilter) {
                    queryOptions.filter().and(filterWCM);
                } else {
                    queryOptions.filter(filterWCM);
                }
            }
        }

        setOperationConfirrmQueryOptionsFilter(context, queryOptions);
        return queryOptions;
    }
}

async function setOperationConfirrmQueryOptionsFilter(context, queryOptions) {
    if (queryOptions && queryOptions.hasFilter) {
        let queryBuilder = context.dataQueryBuilder();
        queryBuilder.filter(queryOptions.filterOption);

        let quickFilters = CommonLibrary.GetSectionedTableFilterTerm(context);
        if (quickFilters) {
            queryBuilder.filter().and(quickFilters);
        }

        let filter = await queryBuilder.filterOption.build();
        CommonLibrary.setStateVariable(context, 'operationConfirrmQueryOptionsFilter', filter, 'WorkOrderOperationsListViewPage');
    }
}
