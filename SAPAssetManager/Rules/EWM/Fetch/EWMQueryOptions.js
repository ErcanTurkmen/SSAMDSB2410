import libVal from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';
import {DocumentTypes} from '../Common/EWMLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function EWMQueryOptions(context) {
    const pageName = libCom.getPageName(context);
    const page = 'EWMFetchDocumentsPage';
    let warehouseNumber, documentType, warehouseOrder, queue, activityArea, processType,
        createdBy, deliveryNumber, dateRangeSwitch, startDate, endDate, creationDateRangeSwitch, creationStartDate, creationEndDate,
        product, handlingUnit, sourceBin, destinationBin;
    if (pageName === page || pageName === 'EWMFetchOnlineDocumentsPage') {
        warehouseNumber = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:${page}/#Control:WarehouseNumberListPicker`).getValue());
        documentType = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:${page}/#Control:DocumentTypeListPicker`).getValue());
        warehouseOrder = context.evaluateTargetPath(`#Page:${page}/#Control:WarehouseOrder`).getValue();
        queue = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:${page}/#Control:QueueListPicker`).getValue());
        activityArea = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:${page}/#Control:ActivityAreaListPicker`).getValue());
        processType = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:${page}/#Control:ProcessTypeListPicker`).getValue());
        createdBy = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:${page}/#Control:CreatedByListPicker`).getValue());
        deliveryNumber = context.evaluateTargetPath(`#Page:${page}/#Control:DeliveryNumber`).getValue();
        dateRangeSwitch = context.evaluateTargetPath(`#Page:${page}/#Control:DateRangeSwitch`).getValue();
        startDate = context.evaluateTargetPath(`#Page:${page}/#Control:StartDate`).getValue();
        endDate = context.evaluateTargetPath(`#Page:${page}/#Control:EndDate`).getValue();
        creationDateRangeSwitch = context.evaluateTargetPath(`#Page:${page}/#Control:CreationDateRangeSwitch`).getValue();
        creationStartDate = context.evaluateTargetPath(`#Page:${page}/#Control:CreationStartDate`).getValue();
        creationEndDate = context.evaluateTargetPath(`#Page:${page}/#Control:CreationEndDate`).getValue();
    } else {
        warehouseNumber = libCom.getStateVariable(context, 'WarehouseNumber');
        documentType = libCom.getStateVariable(context, 'DocumentType');
        warehouseOrder = libCom.getStateVariable(context, 'WarehouseOrder');
        queue = libCom.getStateVariable(context, 'Queue');
        activityArea = libCom.getStateVariable(context, 'ActivityArea');
        processType = libCom.getStateVariable(context, 'ProcessType');
        createdBy = libCom.getStateVariable(context, 'CreatedBy');
        deliveryNumber = libCom.getStateVariable(context, 'DeliveryNumber');
        dateRangeSwitch = libCom.getStateVariable(context, 'DateRangeSwitch');
        startDate = libCom.getStateVariable(context, 'StartDate');
        endDate = libCom.getStateVariable(context, 'EndDate');
        creationDateRangeSwitch = libCom.getStateVariable(context, 'CreationDateRangeSwitch');
        creationStartDate = libCom.getStateVariable(context, 'CreationStartDate');
        creationEndDate = libCom.getStateVariable(context, 'CreationEndDate');
    }

    let odataCreationStartDate = new Date(creationStartDate);
    let odataCreationEndDate = new Date(creationEndDate);
    let odataStartDate = new ODataDate(startDate);
    let odataEndDate = new ODataDate(endDate);
    const creationDateInfo = {
        creationDateRangeSwitch,
        odataCreationStartDate,
        odataCreationEndDate,
    };
    const deliveryDateInfo = {
        dateRangeSwitch,
        odataStartDate,
        odataEndDate,
    };

    let qb;
    if (context.dataQueryBuilder) {
        qb = context.dataQueryBuilder();
    } else {
        qb = context.evaluateTargetPathForAPI('#Page:EWMOverviewPage').getControls()[0].dataQueryBuilder();
    }
    let filtersArray = [];

    if (!libVal.evalIsEmpty(warehouseNumber)) {
        filtersArray.push(`WarehouseNo eq '${warehouseNumber}'`);
    }
    if (!libVal.evalIsEmpty(warehouseOrder)) {
        filtersArray.push(`WarehouseOrder eq '${warehouseOrder}'`);
    }
    if (!libVal.evalIsEmpty(queue)) {
        filtersArray.push(`Queue eq '${queue}'`);
    }
    if (!libVal.evalIsEmpty(activityArea)) {
        filtersArray.push(`ActivityArea eq '${activityArea}'`);
    }
    if (!libVal.evalIsEmpty(processType)) {
        filtersArray.push(`WOProcessType eq '${processType}'`);
    }
    if (!libVal.evalIsEmpty(createdBy)) {
        filtersArray.push(`CreatedBy eq '${createdBy}'`);
    }
    if (!libVal.evalIsEmpty(deliveryNumber)) {
        filtersArray.push(`Delivery eq '${deliveryNumber}'`);
    }
    if (!libVal.evalIsEmpty(product)) {
        filtersArray.push(`Product eq '${product}'`);
    }
    if (!libVal.evalIsEmpty(handlingUnit)) {
        filtersArray.push(`HandlingUnit eq '${handlingUnit}'`);
    }
    if (!libVal.evalIsEmpty(sourceBin)) {
        filtersArray.push(`SourceBin eq '${sourceBin}'`);
    }
    if (!libVal.evalIsEmpty(destinationBin)) {
        filtersArray.push(`DestinationBin eq '${destinationBin}'`);
    }
    filtersArray.push("Resource eq ''");

    let documentTypeFilters = [];
    let dateValue;
    if (!libVal.evalIsEmpty(documentType)) {
        switch (documentType) {
            case DocumentTypes.WarehouseOrder:
                dateValue = getDateTypeWrapper(context, 'createDate', creationDateInfo);             
                if (dateValue) {
                    documentTypeFilters.push(dateValue);
                }
                dateValue = getDateTypeWrapper(context, 'deliveryDate', deliveryDateInfo);
                if (dateValue) {
                    documentTypeFilters.push(dateValue);
                }
                qb.orderBy('WarehouseNo', 'WarehouseOrder');
                break;
            case DocumentTypes.WarehouseTask:
                dateValue = getDateTypeWrapper(context, 'createDate', creationDateInfo);
                if (dateValue) {
                    documentTypeFilters.push(dateValue);
                }
                qb.orderBy('WarehouseNo', 'WarehouseTask');
                break;
            default:
                break;
        }
        if (!libVal.evalIsEmpty(documentTypeFilters)) {
            filtersArray.push('(' + documentTypeFilters.join(' or ') + ')');
        }
    }

    qb.filter('(' + filtersArray.join(' and ') + ')');

    return qb;
}

// adds date to query options for each type (IMObject) if dateRangeSwitch enabled
function getDateTypeWrapper(context, type, dateInfo) {

    if (dateInfo.creationDateRangeSwitch) {
        return `(${getDateFilter(context, type, dateInfo.odataCreationStartDate, dateInfo.odataCreationEndDate)})`;
    }
    if (dateInfo.dateRangeSwitch) {
        return `(${getDateFilter(context, type, dateInfo.odataStartDate, dateInfo.odataEndDate)})`;
    }
    return '';
}

// returns date query based on passing type
function getDateFilter(context, type, odataStartDate, odataEndDate) {
    let datesArray = [];
    switch (type) {
        case 'createDate':
            /*convert to UTC time stamp*/
            datesArray.push(`CrtDateFrom ge '${odataStartDate.toISOString(context).subsring(0,19).replace(/[-:T]/g, '')}'`);
            datesArray.push(`CrtDateTo le '${odataEndDate.toISOString(context).substring(0,19).replace(/[-:T]/g, '')}'`);
            break;
        case 'deliveryDate':
            datesArray.push(`DelDateFrom ge datetime'${odataStartDate.toLocalDateString(context)}'`);
            datesArray.push(`DelDateTo le datetime'${odataEndDate.toLocalDateString(context)}'`);
            break;
        default:
    }
    if (datesArray) {
        return `(${datesArray.join(' and ')})`;
    }
    return '';
}

