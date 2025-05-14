import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import libVal from '../../Common/Library/ValidationLibrary';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
import ClockInClockOutLibrary from '../../ClockInClockOut/ClockInClockOutLibrary';
import Logger from '../../Log/Logger';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

export default function MyWorkSectionFSMFilterQuery(context) {
    let filter = '$filter=';
    let join = '';
    const defaultDates = libWO.getActualDates(context);

    return prepareDataForMyWorkSection(context).then(() => {
        if (IsOperationLevelAssigmentType(context) || IsSubOperationLevelAssigmentType(context)) {
            return WorkOrderOperationsFSMQueryOption(context).then(fsmQueryOptions => {
                if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                    filter += fsmQueryOptions;
                    join = ' and ';
                }
                return libWO.dateOperationsFilter(context, defaultDates, 'SchedEarliestStartDate').then(dateFilter => {
                    CommonLibrary.setStateVariable(context, 'OPERATIONS_DATE_FILTER', dateFilter);
                    filter += join + `${dateFilter}`;
                    return libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, filter);
                });
            });
        } else {
            return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
                if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                    filter += fsmQueryOptions;
                    join = ' and ';
                }
                return libWO.dateOrdersFilter(context, defaultDates, 'ScheduledStartDate').then(dateFilter => {
                    CommonLibrary.setStateVariable(context, 'DATE_FILTER', dateFilter);
                    filter += join + `${dateFilter}`;
                    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, filter);
                });
            });
        }
    });
}

function prepareDataForMyWorkSection(context) {
    CommonLibrary.setStateVariable(context, 'UserRoleType', 'T');
    CommonLibrary.setStateVariable(context, 'StartedCount', 0);

    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    let isUserSupervisorPromise = SupervisorLibrary.isUserSupervisor(context);
    let startedCountPromise;

    let userId = CommonLibrary.getSapUserName(context);
    let isCICOEnabled = ClockInClockOutLibrary.isCICOEnabled(context);
    let queryOption, isAnythingStartedStateVar;
    if (IsOperationLevelAssigmentType(context)) {
        isAnythingStartedStateVar = 'isAnyOperationStarted';
        queryOption = `$filter=OperationMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and OperationMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find operations that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', queryOption);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        isAnythingStartedStateVar = 'isAnySubOperationStarted';
        queryOption = `$filter=SubOpMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and SubOpMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find sub-operations that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderSubOperations', queryOption);
    } else {
        isAnythingStartedStateVar = 'isAnyWorkOrderStarted';
        queryOption = `$expand=OrderMobileStatus_Nav&$filter=OrderMobileStatus_Nav/MobileStatus eq '${STARTED}'`;
        if (isCICOEnabled) {
            queryOption += " and OrderMobileStatus_Nav/CreateUserId eq '" + userId + "'"; //Only find work orders that we started
        }
        startedCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', queryOption);
    }

    return Promise.all([isUserSupervisorPromise, startedCountPromise])
        .then(([isSupervisor, startedCount]) => {
            let roletype = isSupervisor ? 'S' : 'T';
            CommonLibrary.setStateVariable(context, 'UserRoleType', roletype);
            CommonLibrary.setStateVariable(context, 'StartedCount', startedCount);
            CommonLibrary.setStateVariable(context, isAnythingStartedStateVar, startedCount > 0);
            return Promise.resolve();
        })
        .catch((error) => {
            Logger.error('prepareDataForMyWorkSection', error);
            return Promise.resolve();
        });
}
