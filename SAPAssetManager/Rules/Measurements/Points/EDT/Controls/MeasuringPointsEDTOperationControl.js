import Logger from '../../../../Log/Logger';
import IsS4ServiceIntegrationEnabled from '../../../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import EDTHelper from '../MeasuringPointsEDTHelper';

export default async function MeasuringPointsEDTOperationControl(context) {
    const isS4 = IsS4ServiceIntegrationEnabled(context);
    let binding = context.binding;

    let operationsForPoint = getOperationsForBindPoint(context, binding.Point);
    let preSelectedOperation = await getPreSelectedOperation(context, binding, operationsForPoint, isS4);

    let entitySet = isS4 ? 'S4ServiceItems' : 'MyWorkOrderOperations';
    let returnValue = isS4 ? '{ItemNo}' : '{@odata.readLink}';
    let displayValue = isS4 ? '{ItemNo} - {ItemDesc}' : '{OperationNo} - {OperationShortText}';
    let operationsQuery = getOperationsQueryOptions(operationsForPoint, isS4);

    return {
        'Type': 'ListPicker',
        'Name': 'Operation',
        'IsMandatory': false,
        'IsReadOnly': false,
        'Property': 'OperationObjNum',
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
        'Parameters': {
            'Search': {
                'Enabled': true,
                'Delay': 500,
                'MinimumCharacterThreshold': 3,
                'Placeholder': context.localizeText('search'),
                'BarcodeScanner': true,
            },
            'ItemsPerPage': 20,
            'CachedItemsToLoad': 2,
            'Caption': isS4 ? context.localizeText('items') : context.localizeText('operations'),
            'DisplayValue': preSelectedOperation.displayValue,
            'Value': preSelectedOperation.value,
            'PickerItems': {
                'DisplayValue': displayValue,
                'ReturnValue': returnValue,
                'Target': {
                    'EntitySet': entitySet,
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'QueryOptions': operationsQuery,
                },
            },
        },
    };
}

function getOperationsForBindPoint(context, bindPointId) {
    let readingsPage = context.evaluateTargetPathForAPI('#Page:-Current');
    let sectionedTable = readingsPage.getControl('FormCellContainer');
    let edtSection = sectionedTable.getSections()[2];
    let edtExtension = edtSection._context.element.extensions[0];
    let edtExtensionUserData = edtExtension.getUserData();
    let operations = edtExtensionUserData.Operations || [];

    let operationsForPoint = operations.filter(operation => {
        return operation.PointIds.includes(bindPointId);
    });

    return operationsForPoint;
}

function getOperationsQueryOptions(operationsForPoint, isS4) {
    let operationsQuery = '$filter=false';

    if (operationsForPoint.length) {
        let operationIdProperty = isS4 ? 'ItemNo' : 'OperationNo';
        let orderIdProperty = isS4 ? 'ObjectID' : 'OrderId';

        operationsQuery = '$filter=' + operationsForPoint.map(operation => {
            return `(${operationIdProperty} eq '${operation.OperationNo}' and ${orderIdProperty} eq '${operation.OrderId}')`;
        }).join(' or ');
    }

    return operationsQuery;
}

async function getPreSelectedOperation(context, binding, operationsForPoint, isS4) {
    let preSelectedOperation = {
        value: '',
        displayValue: '',
    };

    let operation = await getOperation(context, binding, operationsForPoint, isS4).catch(error => Logger.error('getOperation', error));
    if (operation) {
        if (isS4) {
            preSelectedOperation.value = operation.ItemNo;

            if (operation.ItemDesc) {
                preSelectedOperation.displayValue = operation.ItemNo + ' - ' + operation.ItemDesc;
            } else {
                preSelectedOperation.displayValue = operation.ItemNo ;
            }
        } else {
            preSelectedOperation.value = operation['@odata.readLink'];

            if (operation.OperationShortText) {
                preSelectedOperation.displayValue = operation.OperationNo + ' - ' + operation.OperationShortText;
            } else {
                preSelectedOperation.displayValue = operation.OperationNo ;
            }
        }  
    }

    return preSelectedOperation;
}

function getOperation(context, binding, operationsForPoint, isS4) {
    let operationId = '';
    let orderID = '';

    let latestDoc = EDTHelper.getLatestMeasurementDoc(context, binding);
    if (latestDoc && latestDoc.OperationObjNum) {
        operationId = latestDoc.OperationObjNum;
        orderID = latestDoc.OrderObjNum;
    } else if (operationsForPoint.length) {
        operationId = operationsForPoint[0].OperationNo;
        orderID = operationsForPoint[0].OrderId;
    }

    if (operationId && orderID) {
        if (isS4) {
            let query = `$filter=ItemNo eq '${operationId}' and ObjectID eq '${orderID}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', ['ItemDesc', 'ItemNo'], query).then(result => {
                return result.getItem(0);
            });
        } else if (operationId.length > 6) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `PMMobileStatuses('${operationId}')`, [], '').then(result => {
                let mobileStatus = result.getItem(0);
                let link = `MyWorkOrderOperations(OrderId='${mobileStatus.OrderId}',OperationNo='${mobileStatus.SortField}')`;
            
                return context.read('/SAPAssetManager/Services/AssetManager.service', link, ['OperationShortText', 'OperationNo'], '').then(operationResult => {
                    return operationResult.getItem(0);
                });
            });
        } else {
            let link = `MyWorkOrderOperations(OrderId='${orderID}',OperationNo='${operationId}')`;
            
            return context.read('/SAPAssetManager/Services/AssetManager.service', link, ['OperationShortText', 'OperationNo'], '').then(operationResult => {
                return operationResult.getItem(0);
            });
        }
    }

    return Promise.resolve(null);
}
