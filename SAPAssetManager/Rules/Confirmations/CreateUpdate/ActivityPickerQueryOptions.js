import QueryBuilder from '../../Common/Query/QueryBuilder';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function ActivityPickerQueryOptions(context) {
    let queryBuilder = new QueryBuilder();
    let workOrder = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:WorkOrderLstPkr/#Value'));
    let operation = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:OperationPkr/#Value'));
    let subOperation = libCom.getListPickerValue(libCom.getTargetPathValue(context, '#Control:SubOperationPkr/#Value'));
    const mileageActivityType = libCom.getMileageActivityType(context);
    const expenseActivityType = libCom.getExpenseActivityType(context);

    if (mileageActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${mileageActivityType}'`);
    }

    if (expenseActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${expenseActivityType}'`);
    }

    queryBuilder.addExtra('orderby=ActivityType asc');

    if (libVal.evalIsEmpty(workOrder) && libVal.evalIsEmpty(operation)) {
        workOrder = context.binding.OrderID;
        operation = context.binding.Operation;
        subOperation = context.binding.SubOperation;
    }

    if (!libVal.evalIsEmpty(workOrder) && !libVal.evalIsEmpty(operation)) {

        if (!libVal.evalIsEmpty(subOperation)) { //If Suboperation is selected then we need to use the Work Center of the SubOperation to filter the ActivityTypes
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderSubOperations(OrderId='${workOrder}',OperationNo='${operation}',SubOperationNo='${subOperation}')`, [], '$expand=WorkOrderOperation,WorkOrderOperation/WOHeader&$select=ActivityType,MainWorkCenter,WorkCenterInternalId,WorkOrderOperation/WorkCenterInternalId,WorkOrderOperation/MainWorkCenter,WorkOrderOperation/WOHeader/CostCenter,WorkOrderOperation/WOHeader/ControllingArea,WorkOrderOperation/WOHeader/MainWorkCenter,WorkOrderOperation/WOHeader/WorkCenterInternalId').then(function(data) {
                if (data.getItem(0)) {
                    const subOperationData = data.getItem(0);
                    const operationData = subOperationData.WorkOrderOperation;
                    const workOrderData = operationData.WOHeader;

                    context.getClientData().DefaultActivityType = subOperationData.ActivityType;
                    let workCenter = '';
                    let mainWorkCenter = '';
                    // since WorkCenterInternalId is not set for local objects, additionaly check  MainWorkCenter to get CostCenter and ControllingArea for filter
                    if (!libVal.evalIsEmpty(subOperationData.WorkCenterInternalId) || !libVal.evalIsEmpty(subOperationData.MainWorkCenter)) {
                        workCenter = subOperationData.WorkCenterInternalId;
                        mainWorkCenter = subOperationData.MainWorkCenter;
                    } else if (!libVal.evalIsEmpty(operationData.WorkCenterInternalId) || !libVal.evalIsEmpty(operationData.MainWorkCenter)) {
                        workCenter = operationData.WorkCenterInternalId;
                        mainWorkCenter = operationData.MainWorkCenter;
                    } else if (!libVal.evalIsEmpty(workOrderData.CostCenter) && !libVal.evalIsEmpty(workOrderData.ControllingArea)) {
                        queryBuilder.addFilter(`CostCenter eq '${workOrderData.CostCenter}'`);
                        queryBuilder.addFilter(`ControllingArea eq '${workOrderData.ControllingArea}'`);

                        return queryBuilder.build();
                    } else if (!libVal.evalIsEmpty(workOrderData.WorkCenterInternalId) || !libVal.evalIsEmpty(workOrderData.MainWorkCenter)) {
                        workCenter = workOrderData.WorkCenterInternalId;
                        mainWorkCenter = workOrderData.MainWorkCenter;
                    }

                    if (!libVal.evalIsEmpty(workCenter) || !libVal.evalIsEmpty(mainWorkCenter)) {
                        return addWorkCenterFilter(context, workCenter, mainWorkCenter, queryBuilder);
                    }
                }
                return queryBuilder.build();
            });
        } else {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OrderId='${workOrder}',OperationNo='${operation}')`, [], '$expand=WOHeader&$select=ActivityType,WorkCenterInternalId,MainWorkCenter,WOHeader/WorkCenterInternalId,WOHeader/MainWorkCenter,WOHeader/CostCenter,WOHeader/ControllingArea').then(function(data) {
                if (data.getItem(0)) {
                    const operationData = data.getItem(0);
                    const workOrderData = operationData.WOHeader;

                    context.getClientData().DefaultActivityType = operationData.ActivityType;
                    let workCenter = '';
                    let mainWorkCenter = '';
                    // since WorkCenterInternalId is not set for local objects, additionaly check  MainWorkCenter to get CostCenter and ControllingArea for filter
                    if (!libVal.evalIsEmpty(operationData.WorkCenterInternalId) || !libVal.evalIsEmpty(operationData.MainWorkCenter)) {
                        workCenter = operationData.WorkCenterInternalId;
                        mainWorkCenter = operationData.MainWorkCenter;
                    } else if (!libVal.evalIsEmpty(workOrderData.CostCenter) && !libVal.evalIsEmpty(workOrderData.ControllingArea)) {
                        queryBuilder.addFilter(`CostCenter eq '${workOrderData.CostCenter}'`);
                        queryBuilder.addFilter(`ControllingArea eq '${workOrderData.ControllingArea}'`);

                        return queryBuilder.build();
                    } else if (!libVal.evalIsEmpty(workOrderData.WorkCenterInternalId) || !libVal.evalIsEmpty(workOrderData.MainWorkCenter)) {
                        workCenter = workOrderData.WorkCenterInternalId;
                        mainWorkCenter = workOrderData.MainWorkCenter;
                    }

                    if (!libVal.evalIsEmpty(workCenter) || !libVal.evalIsEmpty(mainWorkCenter)) {
                        return addWorkCenterFilter(context, workCenter, mainWorkCenter, queryBuilder);
                    }
                }
                return queryBuilder.build();
            });
        }
    } else {
        return queryBuilder.build();
    }
}

function addWorkCenterFilter(context, workCenter, mainWorkCenter, queryBuilder) {
    const entity = workCenter ? `WorkCenters(WorkCenterId='${workCenter}',ObjectType='A')` : 'WorkCenters';
    const filterTerm = workCenter ? '' : `&$filter=ExternalWorkCenterId eq '${mainWorkCenter}' and ObjectType eq 'A'`;
    const queryOptions = `$select=CostCenter,ControllingArea${filterTerm}`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], queryOptions).then(function(result) {
        if (!libVal.evalIsEmpty(result)) {
            if (!libVal.evalIsEmpty(result.getItem(0).CostCenter)) {
                queryBuilder.addFilter(`CostCenter eq '${result.getItem(0).CostCenter}'`);
            }
            if (!libVal.evalIsEmpty(result.getItem(0).ControllingArea)) {
                queryBuilder.addFilter(`ControllingArea eq '${result.getItem(0).ControllingArea}'`);
            }
        }
        return queryBuilder.build();
    });
}
