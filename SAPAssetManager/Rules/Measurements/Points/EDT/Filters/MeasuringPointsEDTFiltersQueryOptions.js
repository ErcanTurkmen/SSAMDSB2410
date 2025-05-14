import IsS4ServiceIntegrationEnabled from '../../../../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function MeasuringPointsEDTFiltersQueryOptions(context) {
    let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;

    let values;
    let key;
    let orderId;
    let orderIdFilterString;
    let expand;

    if (context.getName() === 'Equipment') {
        values = filters.EQUIPMENT || [];
        key = 'EquipId';
    }

    if (context.getName() === 'FuncLoc') {
        values = filters.FLOC || [];
        key = 'FuncLocIdIntern';
    }

    if (context.getName() === 'Operations' && !IsS4ServiceIntegrationEnabled(context)) {
        values = filters.OPERATIONS || [];
        key = 'OperationNo';
        orderId = filters.ORDER;
        orderIdFilterString = orderId ? `OrderId eq '${orderId}'` : '';
        expand='$expand=OperationMobileStatus_Nav';
    }

    if (context.getName() === 'S4Items' && IsS4ServiceIntegrationEnabled(context)) {
        values = filters.OPERATIONS || [];
        key = 'ItemNo';
        orderId = filters.ORDER;
        orderIdFilterString = orderId ? `ObjectID eq '${orderId}'` : '';
    }

    return getQueryOptions(values, orderIdFilterString, key, expand);
}

function getQueryOptions(values, orderIdFilterString, key, expand) {
    if (values && values.length) {
        let filterString = values.map(value => `${key} eq '${value}'`).join(' or ');
        if (orderIdFilterString) {
            filterString = `(${filterString}) and ${orderIdFilterString}`;
        }

        let queryOption = `$filter=${filterString}&$orderby=${key}`;
        if (expand) {
            queryOption += '&' + expand;
        }
        return queryOption;
    }
    
    return '$filter=false';
}

