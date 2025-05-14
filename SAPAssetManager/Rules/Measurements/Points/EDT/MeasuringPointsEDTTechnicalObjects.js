import libCommon from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function MeasuringPointsEDTTechnicalObjects(context) {
    let binding = context.binding;
    if (context.getPageProxy() && context.getPageProxy().getActionBinding()) {
        binding = context.getPageProxy().getActionBinding();
    }

    let docNumber;
    if (context.getClientData().FromErrorArchive && context.binding.ErrorObject.RequestBody) {
        docNumber = JSON.parse(context.binding.ErrorObject.RequestBody).MeasurementDocNum;
    }
    if (docNumber) {
        return roundsDocTechnicalObjects(context, binding, docNumber);
    }

    if (libCommon.isDefined(binding)) {
        let odataType = binding['@odata.type'];

        switch (odataType) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrder.global').getValue():
                return roundsWOTechnicalObjects(context, binding);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue(): {
                return roundsOperationTechnicalObjects(context, binding);
            }
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderSubOperation.global').getValue(): {
                return roundsSuboperationTechnicalObjects(context, binding);
            }
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue():
                return roundsEquipmentTechnicalObjects(context, binding);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue():
                return roundsFlocTechnicalObjects(context, binding);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/S4ServiceOrder.global').getValue():
                return roundsS4OrderTechnicalObjects(context, binding);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue():
                return roundsNotificationTechnicalObjects(context, binding);
            case '#sap_mobile.MeasuringPoint':
                return roundsPointTechnicalObjects(context, binding);
            case '#sap_mobile.MeasurementDocument':
                return roundsDocTechnicalObjects(context, binding);
            default:
                return {};
        }
    }

    return {};
}

function roundsWOTechnicalObjects(context, binding) {
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
        '$expand=Equipment/MeasuringPoints/MeasurementDocs,FunctionalLocation/MeasuringPoints/MeasurementDocs,' +
        'Operations/EquipmentOperation/MeasuringPoints/MeasurementDocs,Operations/FunctionalLocationOperation/MeasuringPoints/MeasurementDocs,' +
        'Operations/Tools,' +
        'Operations/NotifHeader_Nav/FunctionalLocation/MeasuringPoints/MeasurementDocs,' +
        'Operations/NotifHeader_Nav/Equipment/MeasuringPoints/MeasurementDocs,' +
        'Operations/WOObjectList_Nav/FuncLoc_Nav/MeasuringPoints/MeasurementDocs,' +
        'Operations/WOObjectList_Nav/Equipment_Nav/MeasuringPoints/MeasurementDocs,' +
        'Operations/SubOperations/EquipmentSubOperation/MeasuringPoints/MeasurementDocs,Operations/SubOperations/FunctionalLocationSubOperation/MeasuringPoints/MeasurementDocs',
    ).then(result => {
        let equipment = [];
        let floc = [];
        let operations = [];

        if (result && result.length > 0) {
            let results = result.getItem(0);

            if (results.Equipment && results.Equipment.MeasuringPoints && !equipment.includes(results.Equipment)) {
                equipment.push(results.Equipment);
            }

            if (results.FunctionalLocation && results.FunctionalLocation.MeasuringPoints && !floc.includes(results.FunctionalLocation)) {
                floc.push(results.FunctionalLocation);
            }

            for (let operation of results.Operations) {
                parseOperationTechnicalObjects(operation, equipment, floc, operations);
            }
        }

        return { 'EQUIPMENT': equipment, 'FLOC': floc, 'OPERATIONS': operations };
    });
}

function parseSuboperationTechnicalObjects(/** @type {MyWorkOrderSubOperation} */ subOperation, equipment, floc) {
    if (subOperation.EquipmentSubOperation && !equipment.find(eq => eq.EquipId === subOperation.EquipmentSubOperation.EquipId) && subOperation.EquipmentSubOperation.MeasuringPoints) {
        equipment.push(subOperation.EquipmentSubOperation);
    }

    if (subOperation.FunctionalLocationSubOperation && !floc.find(fl => fl.FuncLocIdIntern === subOperation.FunctionalLocationSubOperation.FuncLocIdIntern) && subOperation.FunctionalLocationSubOperation.MeasuringPoints) {
        floc.push(subOperation.FunctionalLocationSubOperation);
    }
}

function parseOperationTechnicalObjects(operation, equipment, floc, operations) {
    if (operation.EquipmentOperation && operation.EquipmentOperation.MeasuringPoints) {
        if (!equipment.find(eq => eq.EquipId === operation.EquipmentOperation.EquipId)) {
            equipment.push(operation.EquipmentOperation);
        }

        operations.push({
            'OrderId': operation.OrderId,
            'OperationNo': operation.OperationNo,
            'PointIds': operation.EquipmentOperation.MeasuringPoints.map(point => point.Point),
        });
    }

    if (operation.FunctionalLocationOperation && operation.FunctionalLocationOperation.MeasuringPoints) {
        if (!floc.find(fl => fl.FuncLocIdIntern === operation.FunctionalLocationOperation.FuncLocIdIntern)) {
            floc.push(operation.FunctionalLocationOperation);
        }

        operations.push({
            'OrderId': operation.OrderId,
            'OperationNo': operation.OperationNo,
            'PointIds': operation.FunctionalLocationOperation.MeasuringPoints.map(point => point.Point),
        });
    }

    if (operation.NotifHeader_Nav) {
        if (operation.NotifHeader_Nav.Equipment && operation.NotifHeader_Nav.Equipment.MeasuringPoints) {
            if (!equipment.find(eq => eq.EquipId === operation.NotifHeader_Nav.Equipment.EquipId)) {
                equipment.push(operation.NotifHeader_Nav.Equipment);
            }

            operations.push({
                'OrderId': operation.OrderId,
                'OperationNo': operation.OperationNo,
                'PointIds': operation.NotifHeader_Nav.Equipment.MeasuringPoints.map(point => point.Point),
            });
        }

        if (operation.NotifHeader_Nav.FunctionalLocation && operation.NotifHeader_Nav.FunctionalLocation.MeasuringPoints) {
            if (!floc.find(fl => fl.FuncLocIdIntern === operation.NotifHeader_Nav.FunctionalLocation.FuncLocIdIntern)) {
                floc.push(operation.NotifHeader_Nav.FunctionalLocation);
            }

            operations.push({
                'OrderId': operation.OrderId,
                'OperationNo': operation.OperationNo,
                'PointIds': operation.NotifHeader_Nav.FunctionalLocation.MeasuringPoints.map(point => point.Point),
            });
        }
    }

    if (operation.WOObjectList_Nav && operation.WOObjectList_Nav.length > 0) {
        for (let obj of operation.WOObjectList_Nav) {
            if (obj.Equipment_Nav && obj.Equipment_Nav.MeasuringPoints && obj.Equipment_Nav.MeasuringPoints.length) {
                if (!equipment.find(eq => eq.EquipId === obj.Equipment_Nav.EquipId)) {
                    equipment.push(obj.Equipment_Nav);
                }

                operations.push({
                    'OrderId': operation.OrderId,
                    'OperationNo': operation.OperationNo,
                    'PointIds': obj.Equipment_Nav.MeasuringPoints.map(point => point.Point),
                });
            }

            if (obj.FuncLoc_Nav && obj.FuncLoc_Nav.MeasuringPoints && obj.FuncLoc_Nav.MeasuringPoints.length) {
                if (!floc.find(fl => fl.FuncLocIdIntern === obj.FuncLoc_Nav.FuncLocIdIntern)) {
                    floc.push(obj.FuncLoc_Nav);
                }

                operations.push({
                    'OrderId': operation.OrderId,
                    'OperationNo': operation.OperationNo,
                    'PointIds': obj.FuncLoc_Nav.MeasuringPoints.map(point => point.Point),
                });
            }
        }
    }

    for (let subOperation of operation.SubOperations) {
        if (subOperation.EquipmentSubOperation && !equipment.find(eq => eq.EquipId === subOperation.EquipmentSubOperation.EquipId) && subOperation.EquipmentSubOperation.MeasuringPoints) {
            equipment.push(subOperation.EquipmentSubOperation);
        }

        if (subOperation.FunctionalLocationSubOperation && !floc.find(fl => fl.FuncLocIdIntern === subOperation.FunctionalLocationSubOperation.FuncLocIdIntern) && subOperation.FunctionalLocationSubOperation.MeasuringPoints) {
            floc.push(subOperation.FunctionalLocationSubOperation);
        }
    }
}

function roundsEquipmentTechnicalObjects(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=MeasuringPoints/MeasurementDocs').then(result => {
        let equipment = [];

        if (result && result.length > 0) {
            let results = result.getItem(0);

            if (results.MeasuringPoints) {
                equipment.push(results);
            }
        }

        return { 'EQUIPMENT': equipment };
    });
}

function roundsFlocTechnicalObjects(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=MeasuringPoints/MeasurementDocs').then(result => {
        let floc = [];

        if (result && result.length > 0) {
            let results = result.getItem(0);

            if (results.MeasuringPoints) {
                floc.push(results);
            }
        }

        return { 'FLOC': floc };
    });
}

function roundsS4OrderTechnicalObjects(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],
        '$expand=RefObjects_Nav/Equipment_Nav/MeasuringPoints/MeasurementDocs,' +
        'RefObjects_Nav/FuncLoc_Nav/MeasuringPoints/MeasurementDocs,' +
        'ServiceItems_Nav/RefObjects_Nav/Equipment_Nav/MeasuringPoints/MeasurementDocs,' +
        'ServiceItems_Nav/RefObjects_Nav/FuncLoc_Nav/MeasuringPoints/MeasurementDocs',
    ).then(result => {
        let equipment = [];
        let floc = [];
        let operations = [];

        if (result && result.length > 0) {
            let results = result.getItem(0);

            for (let refObject of results.RefObjects_Nav) {
                if (refObject.Equipment_Nav && !equipment.find(eq => eq.EquipId === refObject.Equipment_Nav.EquipId) &&
                    refObject.Equipment_Nav.MeasuringPoints && refObject.Equipment_Nav.MeasuringPoints.length) {
                    equipment.push(refObject.Equipment_Nav);
                }

                if (refObject.FuncLoc_Nav && !floc.find(fl => fl.FuncLocIdIntern === refObject.FuncLoc_Nav.FuncLocIdIntern) &&
                    refObject.FuncLoc_Nav.MeasuringPoints && refObject.FuncLoc_Nav.MeasuringPoints.length) {
                    floc.push(refObject.FuncLoc_Nav);
                }
            }

            for (let item of results.ServiceItems_Nav) {
                for (let refObject of item.RefObjects_Nav) {
                    if (refObject.Equipment_Nav && refObject.Equipment_Nav.MeasuringPoints && refObject.Equipment_Nav.MeasuringPoints.length) {
                        if (!equipment.find(eq => eq.EquipId === refObject.Equipment_Nav.EquipId)) {
                            equipment.push(refObject.Equipment_Nav);
                        }

                        operations.push({
                            'OrderId': item.ObjectID,
                            'OperationNo': item.ItemNo,
                            'PointIds': refObject.Equipment_Nav.MeasuringPoints.map(point => point.Point),
                        });
                    }

                    if (refObject.FuncLoc_Nav && refObject.FuncLoc_Nav.MeasuringPoints && refObject.FuncLoc_Nav.MeasuringPoints.length) {
                        if (!floc.find(fl => fl.FuncLocIdIntern === refObject.FuncLoc_Nav.FuncLocIdIntern)) {
                            floc.push(refObject.FuncLoc_Nav);
                        }

                        operations.push({
                            'OrderId': item.ObjectID,
                            'OperationNo': item.ItemNo,
                            'PointIds': refObject.FuncLoc_Nav.MeasuringPoints.map(point => point.Point),
                        });
                    }
                }
            }
        }

        return { 'EQUIPMENT': equipment, 'FLOC': floc, 'OPERATIONS': operations };
    });
}

function roundsNotificationTechnicalObjects(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],
        '$expand=Equipment/MeasuringPoints/MeasurementDocs,FunctionalLocation/MeasuringPoints/MeasurementDocs',
    ).then(result => {
        let equipment = [];
        let floc = [];

        if (result && result.length > 0) {
            const notification = result.getItem(0);

            if (notification.Equipment && !equipment.includes(notification.Equipment) && notification.Equipment.MeasuringPoints) {
                equipment.push(notification.Equipment);
            }

            if (notification.FunctionalLocation && !floc.includes(notification.FunctionalLocation) && notification.FunctionalLocation.MeasuringPoints) {
                floc.push(notification.FunctionalLocation);
            }
        }

        return { 'EQUIPMENT': equipment, 'FLOC': floc };
    });
}

function roundsOperationTechnicalObjects(context, binding) {
    if (libCommon.getPageName(context) === 'PRTListViewPage') {
        return roundsPRTTechnicalObjects(context, binding);
    }

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
        '$expand=WOHeader,EquipmentOperation/MeasuringPoints/MeasurementDocs,FunctionalLocationOperation/MeasuringPoints/MeasurementDocs,' +
        'NotifHeader_Nav/FunctionalLocation/MeasuringPoints/MeasurementDocs,NotifHeader_Nav/Equipment/MeasuringPoints/MeasurementDocs,' +
        'WOObjectList_Nav/FuncLoc_Nav/MeasuringPoints/MeasurementDocs,WOObjectList_Nav/Equipment_Nav/MeasuringPoints/MeasurementDocs,' +
        'SubOperations/EquipmentSubOperation/MeasuringPoints/MeasurementDocs,SubOperations/FunctionalLocationSubOperation/MeasuringPoints/MeasurementDocs',
    ).then(result => {
        let equipment = [];
        let floc = [];
        let operations = [];

        if (result && result.length > 0) {
            let results = result.getItem(0);
            parseOperationTechnicalObjects(results, equipment, floc, operations);
        }

        return { 'EQUIPMENT': equipment, 'FLOC': floc, 'OPERATIONS': operations };
    });
}

function roundsSuboperationTechnicalObjects(context, /** @type {MyWorkOrderSubOperation} */ binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [],
        '$expand=EquipmentSubOperation/MeasuringPoints/MeasurementDocs,FunctionalLocationSubOperation/MeasuringPoints/MeasurementDocs',
    ).then(suboperations => {
        const equipment = [];
        const floc = [];

        if (!ValidationLibrary.evalIsEmpty(suboperations)) {
            const sop = suboperations.getItem(0);
            parseSuboperationTechnicalObjects(sop, equipment, floc);
        }

        return { 'EQUIPMENT': equipment, 'FLOC': floc };
    });
}

function roundsPRTTechnicalObjects(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'] + '/Tools', [], "$filter=(PRTCategory eq 'P')&$expand=PRTPoint/MeasurementDocs").then(results => {
        let prt = [];
        let operations = [];

        if (results && results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                let result = results.getItem(i);
                if (result.PRTPoint) {
                    operations.push({
                        'OrderId': result.OrderId,
                        'OperationNo': result.OperationNo,
                        'PointIds': [result.Point],
                    });
                    prt.push(result);
                }
            }
        }

        return { 'PRT': prt, 'OPERATIONS': operations };
    });
}

function roundsPointTechnicalObjects(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=Equipment,FunctionalLocation,WorkOrderTool,MeasurementDocs').then(result => {
        let point = result.getItem(0);
        return { 'POINT': point };
    });
}

function roundsDocTechnicalObjects(context, binding, docNumber) {
    if (docNumber) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasurementDocuments', [], `$filter=MeasurementDocNum eq '${docNumber}'&$expand=MeasuringPoint,MeasuringPoint/Equipment,MeasuringPoint/FunctionalLocation,MeasuringPoint/WorkOrderTool`).then(result => {
            if (result.length) {
                let doc = result.getItem(0);
                let point = doc.MeasuringPoint;
                point.MeasurementDocs = [doc];
                return { 'POINT': point, 'DOCUMENT_ID': docNumber };
            } else {
                return {};
            }
        });
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.readLink'], [], '$expand=MeasuringPoint,MeasuringPoint/Equipment,MeasuringPoint/FunctionalLocation,MeasuringPoint/WorkOrderTool').then(result => {
        let doc = result.getItem(0);
        let point = doc.MeasuringPoint;
        point.MeasurementDocs = [doc];
        return { 'POINT': point, 'DOCUMENT_ID': doc.MeasurementDocNum };
    });
}
