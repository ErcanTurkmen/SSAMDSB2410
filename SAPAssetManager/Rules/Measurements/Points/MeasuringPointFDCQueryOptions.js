import libCommon from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

function roundsQueryOptions(context) {
    let binding = context.getPageProxy().binding;
    let swipeBinding = context.getPageProxy().getActionBinding();
    if (swipeBinding) {
        binding = swipeBinding;
    }
    if (!binding && context.binding) {
        binding = context.binding;
    }
    let MeasuringPointData = {};

    /* Query options are in the following order:
     * 1. Expand
     *    a. Equipment Measuring Points
     *    b. FLOC Measuring Points
     *
     *    c. Operation Equipment Measuring Points
     *    d. Operation FLOC Measuring Points
     *
     *    e. Sub Operation Equipment Measuring Points
     *    f. Sub Operation FLOC Measuring Points
     *  2. Select
     *    a. Equipment Measuring Points - Point Number
     *    b. FLOC Measuring Points - Point Number
     *
     *    c. Operation Equipment Measuring Points - Point Number
     *    d. Operation FLOC Measuring Points - Point Number
     *
     *    e. Sub Operation Equipment Measuring Points - Point Number
     *    f. Sub Operation FLOC Measuring Points - Point Number
     *
     *    g. Operation ObjectKey
     *    h. Sub-Operation ObjectKey
     *
     *  Equipment/FLOC associated Work Order and Operation is stored on Client Data
     */
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],
        '$expand=Equipment/MeasuringPoints,FunctionalLocation/MeasuringPoints,' +
        'Operations/EquipmentOperation/MeasuringPoints,Operations/FunctionalLocationOperation/MeasuringPoints,' +
        'Operations/Tools,' +
        'Operations/NotifHeader_Nav/FunctionalLocation/MeasuringPoints,' +
        'Operations/NotifHeader_Nav/Equipment/MeasuringPoints,' +
        'Operations/WOObjectList_Nav/FuncLoc_Nav/MeasuringPoints,' +
        'Operations/WOObjectList_Nav/Equipment_Nav/MeasuringPoints,' +
        'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints&' +
        '$select=Equipment/EquipId,Equipment/MeasuringPoints/Point,FunctionalLocation/FuncLocIdIntern,FunctionalLocation/MeasuringPoints/Point,' +
        'Operations/EquipmentOperation/MeasuringPoints/Point,Operations/FunctionalLocationOperation/MeasuringPoints/Point,' +
        'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints/Point,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints/Point,' +
        'Operations/ObjectKey,Operations/SubOperations/ObjectKey,Operations/OperationNo,Operations/SubOperations/OperationNo,Operations/OperationShortText,Operations/SubOperations/OperationShortText,Operations/Tools/PRTCategory,' +
        'Operations/SubOperations/SubOperationNo',
    ).then(function(result) {
        if (result && result.length > 0) {
            let out = [];
            let results = result.getItem(0);
            let tempOperation;

            // Top-level Equipment?
            if (results.Equipment) {
                for (let pt of results.Equipment.MeasuringPoints) {
                    out.push(`Point eq '${pt.Point}'`);
                    MeasuringPointData[pt.Point] = { 'OrderId': binding.ObjectKey, 'Operation': '' };
                }
            }
            // Top-level FLOC?
            if (results.FunctionalLocation) {
                for (let pt of results.FunctionalLocation.MeasuringPoints) {
                    out.push(`Point eq '${pt.Point}'`);
                    MeasuringPointData[pt.Point] = { 'OrderId': binding.ObjectKey, 'Operation': '' };
                }
            }
            // Operations
            for (let op of results.Operations) {
                operationMeasuringPointsGet(op, MeasuringPointData, out, tempOperation, binding.ObjectKey);
            }

            //Final formatting of the operations string
            return formatQueryString(context, MeasuringPointData, out);
        }
        return '';
    });
}

//Concatenate the operations together used on each point
function FormatOperations(newOperation, finalList) {
    let list = '';
    if (finalList) {
        list = finalList;
    }
    if (newOperation) {
        if (list.indexOf('|' + newOperation + '|') === -1) {
            list += '|' + newOperation + '|';
        }
    }
    return list;
}

export default function MeasuringPointFDCQueryOptions(context, actionBinding) {
    let binding = actionBinding || context.getPageProxy().binding;
    if (!binding || binding.constructor.name !== 'Object') {
        binding = context.binding;
    }
    if (libCommon.isDefined(binding)) {
        let odataType = binding['@odata.type'];

        switch (odataType) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue():
                return roundsQueryOptions(context);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue():
                return suboperationQueryOptions(context, binding);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue(): {
                return libCommon.getPageName(context) === 'PRTListViewPage' ?
                    Promise.resolve("$filter=(PRTCategory eq 'P')&$expand=PRTPoint/MeasurementDocs,PRTPoint/MeasurementDocs/MeasuringPoint,PRTPoint/Equipment,PRTPoint/FunctionalLocation,WOOperation_Nav,WOOperation_Nav/WOHeader&$orderby=ItemNum") :
                    operationQueryOptions(context, binding);
            }
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue():
                return Promise.resolve('$expand=MeasurementDocs&$orderby=SortField');
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue():
                return Promise.resolve('$expand=FunctionalLocation,MeasurementDocs&$orderby=SortField');
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue():
                return s4RoundsQueryOptions(context, binding);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue():
                return notificationRoundsQueryOptions(context);
            default:
                return Promise.resolve('');
        }
    }
}

function s4RoundsQueryOptions(context, binding) {
    let MeasuringPointData = {};

    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],
        '$expand=RefObjects_Nav/Equipment_Nav/MeasuringPoints,' +
        'RefObjects_Nav/FuncLoc_Nav/MeasuringPoints,' +
        'ServiceItems_Nav/RefObjects_Nav/Equipment_Nav/MeasuringPoints,' +
        'ServiceItems_Nav/RefObjects_Nav/FuncLoc_Nav/MeasuringPoints' +
        '&$select=RefObjects_Nav/Equipment_Nav/EquipId,RefObjects_Nav/Equipment_Nav/MeasuringPoints/Point,' +
        'RefObjects_Nav/FuncLoc_Nav/FuncLocIdIntern,RefObjects_Nav/FuncLoc_Nav/MeasuringPoints/Point,' +
        'ServiceItems_Nav/RefObjects_Nav/Equipment_Nav/MeasuringPoints/Point,' +
        'ServiceItems_Nav/RefObjects_Nav/FuncLoc_Nav/MeasuringPoints/Point,' +
        'ServiceItems_Nav/ItemNo,ServiceItems_Nav/ItemDesc',
    ).then(function(result) {
        if (result && result.length > 0) {
            let filter = [];
            let results = result.getItem(0);

            for (let refObject of results.RefObjects_Nav) {
                if (refObject.Equipment_Nav) {
                    for (let point of refObject.Equipment_Nav.MeasuringPoints) {
                        filter.push(`Point eq '${point.Point}'`);
                        MeasuringPointData[point.Point] = { 'OrderId': binding.ObjectID, 'Operation': '' };
                    }
                }
                if (refObject.FuncLoc_Nav) {
                    for (let point of refObject.FuncLoc_Nav.MeasuringPoints) {
                        filter.push(`Point eq '${point.Point}'`);
                        MeasuringPointData[point.Point] = { 'OrderId': binding.ObjectID, 'Operation': '' };
                    }
                }
            }

            for (let item of results.ServiceItems_Nav) {
                for (let refObject of item.RefObjects_Nav) {
                    if (refObject.Equipment_Nav) {
                        for (let point of refObject.Equipment_Nav.MeasuringPoints) {
                            let pointNo = point.Point;
                            filter.push(`Point eq '${pointNo}'`);

                            let tempOperation = item.ItemNo;
                            if (Object.prototype.hasOwnProperty.call(MeasuringPointData, pointNo) && MeasuringPointData[pointNo].OperationNo) {  //Multiple operations use this point
                                tempOperation = FormatOperations(tempOperation, MeasuringPointData[pointNo].OperationNo);
                            } else {
                                tempOperation = '|' + tempOperation + '|';
                            }
                            MeasuringPointData[pointNo] = { 'OrderId': binding.ObjectID, 'Operation': item.ItemNo, 'OperationNo': tempOperation, 'OperationShortText': item.ItemDesc };
                        }
                    }
                    if (refObject.FuncLoc_Nav) {
                        for (let point of refObject.FuncLoc_Nav.MeasuringPoints) {
                            let pointNo = point.Point;
                            filter.push(`Point eq '${pointNo}'`);

                            let tempOperation = item.ItemNo;
                            if (Object.prototype.hasOwnProperty.call(MeasuringPointData, pointNo) && MeasuringPointData[pointNo].OperationNo) {  //Multiple operations use this point
                                tempOperation = FormatOperations(tempOperation, MeasuringPointData[pointNo].OperationNo);
                            } else {
                                tempOperation = '|' + tempOperation + '|';
                            }
                            MeasuringPointData[pointNo] = { 'OrderId': binding.ObjectID, 'Operation': item.ItemNo, 'OperationNo': tempOperation, 'OperationShortText': item.ItemDesc };
                        }
                    }
                }
            }

            //Final formatting of the operations string
            return formatQueryString(context, MeasuringPointData, filter);
        }

        return '';
    });
}

function notificationRoundsQueryOptions(context) {
    const binding = context.getPageProxy().binding;

    const MeasuringPointData = {};

    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],
        '$expand=Equipment/MeasuringPoints,FunctionalLocation/MeasuringPoints,NotifMobileStatus_Nav' +
        '&$select=ObjectKey,Equipment/EquipId,Equipment/MeasuringPoints/Point,FunctionalLocation/FuncLocIdIntern,FunctionalLocation/MeasuringPoints/Point,NotifMobileStatus_Nav/ObjectKey',
    ).then(function(result) {
        if (result && result.length > 0) {
            const out = [];
            const notification = result.getItem(0);
            const notificationNumber = notification.ObjectKey || notification.NotifMobileStatus_Nav.ObjectKey;

            if (notification.Equipment) {
                for (let pt in notification.Equipment.MeasuringPoints) {
                    out.push(`Point eq '${notification.Equipment.MeasuringPoints[pt].Point}'`);
                    MeasuringPointData[notification.Equipment.MeasuringPoints[pt].Point] = { 'NotificationNumber': notificationNumber };
                }
            }

            if (notification.FunctionalLocation) {
                for (let pt in notification.FunctionalLocation.MeasuringPoints) {
                    out.push(`Point eq '${notification.FunctionalLocation.MeasuringPoints[pt].Point}'`);
                    MeasuringPointData[notification.FunctionalLocation.MeasuringPoints[pt].Point] = { 'NotificationNumber': notificationNumber };
                }
            }
            return getFilterQuery(out, context, MeasuringPointData);
        }
        return '';
    });
}

function getFilterQuery(out, context, MeasuringPointData) {
    if (out.length) {
        context.getPageProxy().getClientData().MeasuringPointData = MeasuringPointData;
        return '$filter=' + out.join(' or ') + '&$expand=WorkOrderTool,FunctionalLocation,Equipment,MeasurementDocs&$orderby=FunctionalLocation/FuncLocId,EquipId,SortField';
    } else {
        return '';
    }
}

/**
 * @param {IPageProxy} context
 * @param {MyWorkOrderSubOperation} binding
 */
function suboperationQueryOptions(context, binding) {
    const MeasuringPointData = {};
    const toExpand = [
        'EquipmentSubOperation',
        'EquipmentSubOperation/MeasuringPoints',
        'FunctionalLocationSubOperation',
        'FunctionalLocationSubOperation/MeasuringPoints',
        'WorkOrderOperation',
        'WorkOrderOperation/WOHeader',
        'WorkOrderOperation/Tools',
    ];
    const toSelect = [
        'OperationNo',
        'EquipmentSubOperation/MeasuringPoints/Point',
        'FunctionalLocationSubOperation/MeasuringPoints/Point',
        'WorkOrderOperation/WOHeader/ObjectKey',
        'WorkOrderOperation/Tools/PRTCategory',
        'WorkOrderOperation/ObjectKey',
    ];
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], `$expand=${toExpand.join(',')}&$select=${toSelect.join(',')}`).then(suboperations => {
        if (ValidationLibrary.evalIsEmpty(suboperations)) {
            return '';
        }
        const out = [];
        const sop = suboperations.getItem(0);

        suboperationMeasuringPointsGet(sop, MeasuringPointData, out);
        //Final formatting of the operations string
        return formatQueryString(context, MeasuringPointData, out);
    });
}


function suboperationMeasuringPointsGet(/** @type {MyWorkOrderSubOperation} */ sop, MeasuringPointData, out) {
    if (sop.EquipmentSubOperation) {
        for (let pt of sop.EquipmentSubOperation.MeasuringPoints) {
            _suboperationPoint(sop, MeasuringPointData, out, pt);
        }
    }
    if (sop.FunctionalLocationSubOperation) {
        for (let pt of sop.FunctionalLocationSubOperation.MeasuringPoints) {
            _suboperationPoint(sop, MeasuringPointData, out, pt);
        }
    }
}

function _suboperationPoint(/** @type {MyWorkOrderSubOperation} */ sop, MeasuringPointData, out, pt) {
    const orderId = sop.WorkOrderOperation.WOHeader?.ObjectKey;
    const operationShortText = sop.WorkOrderOperation.Tools?.PRTCategory;
    out.push(`Point eq '${pt.Point}'`);
    const tempOperation = `${sop.OperationNo}-${sop.SubOperationNo}`;
    //Multiple operations use this point?
    const operationNo = MeasuringPointData[pt.Point]?.OperationNo ? FormatOperations(tempOperation, MeasuringPointData[pt.Point].OperationNo) : `|${tempOperation}|`;
    MeasuringPointData[pt.Point] = { 'OrderId': orderId, 'Operation': sop.WorkOrderOperation.ObjectKey, 'OperationNo': operationNo, 'OperationShortText': operationShortText };
}

function operationQueryOptions(context, actionBinding) {
    let binding = actionBinding || context.getPageProxy().binding;
    let swipeBinding = context.getPageProxy().getActionBinding();
    if (swipeBinding) {
        binding = swipeBinding;
    }
    if (!binding && context.binding) { //Object card
        binding = context.binding;
    }
    let MeasuringPointData = {};

    /* Query options are in the following order:
     * 1. Expand
     *    a. Equipment Measuring Points
     *    b. FLOC Measuring Points
     *
     *    c. Notification Equipment Measuring Points
     *    d. Notification FLOC Measuring Points
     *
     *    e. Sub Operation Equipment Measuring Points
     *    f. Sub Operation FLOC Measuring Points
     *  2. Select
     *    a. Equipment Measuring Points - Point Number
     *    b. FLOC Measuring Points - Point Number
     *
     *    c. Notification Equipment Measuring Points - Point Number
     *    d. Notification FLOC Measuring Points - Point Number
     *
     *    e. Sub Operation Equipment Measuring Points - Point Number
     *    f. Sub Operation FLOC Measuring Points - Point Number
     *
     *    g. Operation ObjectKey
     *    h. Sub-Operation ObjectKey
     *
     *  Equipment/FLOC associated with Operation is stored on Client Data
     */
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],
        '$expand=WOHeader,EquipmentOperation/MeasuringPoints,FunctionalLocationOperation/MeasuringPoints,Tools,' +
        'NotifHeader_Nav/FunctionalLocation/MeasuringPoints,NotifHeader_Nav/Equipment/MeasuringPoints,' +
        'WOObjectList_Nav/FuncLoc_Nav/MeasuringPoints,WOObjectList_Nav/Equipment_Nav/MeasuringPoints,' +
        'SubOperations/EquipmentSubOperation/MeasuringPoints,SubOperations/FunctionalLocationSubOperation/MeasuringPoints&' +
        '$select=OrderId,OperationNo,WOHeader/ObjectKey,EquipmentOperation/MeasuringPoints/Point,FunctionalLocationOperation/MeasuringPoints/Point,' +
        'SubOperations/EquipmentSubOperation/MeasuringPoints/Point,SubOperations/FunctionalLocationSubOperation/MeasuringPoints/Point,' +
        'ObjectKey,SubOperations/ObjectKey,SubOperations/OperationNo,OperationShortText,SubOperations/OperationShortText,Tools/PRTCategory,' +
        'SubOperations/SubOperationNo',
    ).then(function(result) {
        if (result && result.length > 0) {
            let out = [];
            let results = result.getItem(0);
            let tempOperation;

            operationMeasuringPointsGet(results, MeasuringPointData, out, tempOperation, results.WOHeader && results.WOHeader.ObjectKey);
            //Final formatting of the operations string
            return formatQueryString(context, MeasuringPointData, out);
        }
        return '';
    });
}

function operationMeasuringPointsGet(/** @type {MyWorkOrderOperation} */ operation, MeasuringPointData, out, tempOperation, orderId) {
    // Operation Equipment?
    if (operation.EquipmentOperation) {
        for (let pt of operation.EquipmentOperation.MeasuringPoints) {
            out.push(`Point eq '${pt.Point}'`);
            tempOperation = operation.OperationNo;
            let item = pt.Point;
            if (Object.prototype.hasOwnProperty.call(MeasuringPointData, item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                tempOperation = FormatOperations(tempOperation, MeasuringPointData[item].OperationNo);
            } else {
                tempOperation = '|' + tempOperation + '|';
            }
            MeasuringPointData[pt.Point] = { 'OrderId': orderId, 'Operation': operation.ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': operation.OperationShortText, 'Operations/Tools/PRTCategory': operation.Tools && operation.Tools.PRTCategory };
        }
    }
    // Operation FLOC?
    if (operation.FunctionalLocationOperation) {
        for (let pt of operation.FunctionalLocationOperation.MeasuringPoints) {
            out.push(`Point eq '${pt.Point}'`);
            tempOperation = operation.OperationNo;
            let item = pt.Point;
            if (Object.prototype.hasOwnProperty.call(MeasuringPointData, item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                tempOperation = FormatOperations(tempOperation, MeasuringPointData[item].OperationNo);
            } else {
                tempOperation = '|' + tempOperation + '|';
            }
            MeasuringPointData[pt.Point] = { 'OrderId': orderId, 'Operation': operation.ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': operation.Tools && operation.Tools.PRTCategory };
        }
    }

    // Operation's notification equipment
    if (operation.NotifHeader_Nav && operation.NotifHeader_Nav.Equipment) {
        for (let pt of operation.NotifHeader_Nav.Equipment.MeasuringPoints) {
            out.push(`Point eq '${pt.Point}'`);
            tempOperation = operation.OperationNo;
            let item = pt.Point;
            if (Object.prototype.hasOwnProperty.call(MeasuringPointData, item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                tempOperation = FormatOperations(tempOperation, MeasuringPointData[item].OperationNo);
            } else {
                tempOperation = '|' + tempOperation + '|';
            }
            MeasuringPointData[pt.Point] = { 'OrderId': orderId, 'Operation': operation.ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': operation.Tools && operation.Tools.PRTCategory };
        }
    }

    // Operation's notification FLOC
    if (operation.NotifHeader_Nav && operation.NotifHeader_Nav.FunctionalLocation) {
        for (let pt of operation.NotifHeader_Nav.FunctionalLocation.MeasuringPoints) {
            out.push(`Point eq '${pt.Point}'`);
            tempOperation = operation.OperationNo;
            let item = pt.Point;
            if (Object.prototype.hasOwnProperty.call(MeasuringPointData, item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                tempOperation = FormatOperations(tempOperation, MeasuringPointData[item].OperationNo);
            } else {
                tempOperation = '|' + tempOperation + '|';
            }
            MeasuringPointData[pt.Point] = { 'OrderId': orderId, 'Operation': operation.ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': operation.Tools && operation.Tools.PRTCategory };
        }
    }

    // Operation's objectlist equipment & FLOC
    if (operation.WOObjectList_Nav && operation.WOObjectList_Nav.length > 0) {
        for (let obj of operation.WOObjectList_Nav) {
            // objectlist equipment
            if (obj.Equipment_Nav) {
                for (const _pt6 of obj.Equipment_Nav.MeasuringPoints) {
                    out.push('Point eq \'' + _pt6.Point + '\'');
                    tempOperation = operation.OperationNo;
                    const _item4 = _pt6.Point;
                    if (Object.prototype.hasOwnProperty.call(MeasuringPointData, _item4) && MeasuringPointData[_item4].OperationNo) {
                        //Multiple operations use this point
                        tempOperation = FormatOperations(tempOperation, MeasuringPointData[_item4].OperationNo);
                    } else {
                        tempOperation = '|' + tempOperation + '|';
                    }
                    MeasuringPointData[_pt6.Point] = { 'OrderId': orderId, 'Operation': operation.ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': operation.Tools && operation.Tools.PRTCategory };
                }
            }
            // objectlist FLOC
            if (obj.FuncLoc_Nav) {
                for (const _pt7 of obj.FuncLoc_Nav.MeasuringPoints) {
                    out.push('Point eq \'' + _pt7.Point + '\'');
                    tempOperation = operation.OperationNo;
                    const _item5 = _pt7.Point;
                    if (Object.prototype.hasOwnProperty.call(MeasuringPointData, _item5) && MeasuringPointData[_item5].OperationNo) {
                        //Multiple operations use this point
                        tempOperation = FormatOperations(tempOperation, MeasuringPointData[_item5].OperationNo);
                    } else {
                        tempOperation = '|' + tempOperation + '|';
                    }
                    MeasuringPointData[_pt7.Point] = { 'OrderId': orderId, 'Operation': operation.ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': operation.Tools && operation.Tools.PRTCategory };
                }
            }
        }
    }

    // Suboperations
    for (let sop of operation.SubOperations) {
        // Suboperation Equipment?
        if (sop.EquipmentSubOperation) {
            for (let pt of sop.EquipmentSubOperation.MeasuringPoints) {
                out.push(`Point eq '${pt.Point}'`);
                tempOperation = sop.OperationNo + '-' + sop.SubOperationNo;
                let item = pt.Point;
                if (Object.prototype.hasOwnProperty.call(MeasuringPointData, item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                    tempOperation = FormatOperations(tempOperation, MeasuringPointData[item].OperationNo);
                } else {
                    tempOperation = '|' + tempOperation + '|';
                }
                MeasuringPointData[pt.Point] = { 'OrderId': orderId, 'Operation': operation.ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': operation.Tools && operation.Tools.PRTCategory };
            }
        }
        // Suboperation FLOC?
        if (sop.FunctionalLocationSubOperation) {
            for (let pt of sop.FunctionalLocationSubOperation.MeasuringPoints) {
                out.push(`Point eq '${pt.Point}'`);
                tempOperation = sop.OperationNo + '-' + sop.SubOperationNo;
                let item = pt.Point;
                if (Object.prototype.hasOwnProperty.call(MeasuringPointData, item) && MeasuringPointData[item].OperationNo) {  //Multiple operations use this point
                    tempOperation = FormatOperations(tempOperation, MeasuringPointData[item].OperationNo);
                } else {
                    tempOperation = '|' + tempOperation + '|';
                }
                MeasuringPointData[pt.Point] = { 'OrderId': orderId, 'Operation': operation.ObjectKey, 'OperationNo': tempOperation, 'OperationShortText': operation.Tools && operation.Tools.PRTCategory };
            }
        }
    }
}

function formatQueryString(context, MeasuringPointData, out) {
    //Final formatting of the operations string
    for (let pointKey in MeasuringPointData) {
        let point = MeasuringPointData[pointKey];
        let op = point.OperationNo;
        let opArray;
        if (op) {
            op.replace('||', '|');
            opArray = op.split('|');
            opArray.sort(); //Order the operations
            point.OperationNo = '';
            opArray.forEach(function(newOp) {
                if (newOp) {
                    point.OperationNo += ',' + newOp;
                }
            });
            point.OperationNo = point.OperationNo.substring(1);
        }
    }

    if (out && out.length > 0) {
        context.getPageProxy().getClientData().MeasuringPointData = MeasuringPointData;
        return '$filter=' + out.join(' or ') + '&$expand=WorkOrderTool,FunctionalLocation,Equipment,MeasurementDocs&$orderby=FunctionalLocation/FuncLocId,EquipId,SortField';
    } else {
        return '';
    }
}
