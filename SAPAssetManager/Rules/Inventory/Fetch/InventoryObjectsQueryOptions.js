import libVal from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InventoryObjectsQueryOptions(context) {
    const pageInfo = context._page || context.currentPage || context.getPageProxy()._page;
    let documentID, documentType, dateRangeSwitch, startDate, endDate, plant, sloc;
    if (pageInfo && (pageInfo.definition.name === 'FetchDocumentsPage' || pageInfo.definition.name === 'FetchOnlineDocumentsPage')) {
        documentID = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DocumentId').getValue();
        documentType = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DocumentTypeListPicker').getValue();
        dateRangeSwitch = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:DateRangeSwitch').getValue();
        startDate = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:StartDate').getValue();
        endDate = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:EndDate').getValue();
        plant = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:PlantLstPkr').getValue();
        sloc = context.evaluateTargetPath('#Page:FetchDocumentsPage/#Control:SLoctLstPkr').getValue();
    } else {
        documentID = libCom.getStateVariable(context, 'DocumentID');
        documentType = libCom.getStateVariable(context, 'DocumentType');
        dateRangeSwitch = libCom.getStateVariable(context, 'DateRangeSwitch');
        startDate = libCom.getStateVariable(context, 'StartDate');
        endDate = libCom.getStateVariable(context, 'EndDate');
        plant = libCom.getStateVariable(context, 'Plant');
        sloc = libCom.getStateVariable(context, 'Sloc');
    }
    let reservationFlag = false;
    let workOrderFlag = false;
    let addOrderIdToSearch = false;

    let odataStartDate = new ODataDate(startDate);
    let odataEndDate = new ODataDate(endDate);
    const dateInfo = {
        dateRangeSwitch,
        odataStartDate,
        odataEndDate,
    };

    let qb;
    if (context.dataQueryBuilder) {
        qb = context.dataQueryBuilder();
    } else {
        qb = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getControls()[0].dataQueryBuilder();
    }
    let filtersArray = [];

    // no ability to search with use of substing in online service, but leaving this code for perspective
    // if (searchString) {
    //     searchString = searchString.toLowerCase();
    //     filtersArray.push(`substringof('${searchString}', tolower(ObjectId))`);
    // }

    if (!libVal.evalIsEmpty(documentID) && documentID.length > 0) {
        if (checkForMDocAvailableTypes(documentType, documentID)) {
            filtersArray.push(`ObjectId eq '${documentID.substring(0, 10)}' and MatDocYear eq '${documentID.substring(10, 14)}'`);
        } else {
            filtersArray.push(`ObjectId eq '${documentID}'`);
        }
    }

    if (plant.length > 0) {
        filtersArray.push(`Plant eq '${plant[0].ReturnValue}'`);
        if (sloc.length > 0) {
            filtersArray.push(`StorageLocation eq '${sloc[0].ReturnValue}'`);
        }
    }

    // if document length is 14, then user probably is searching for the document with help of doc year
    // currently backend supports it only for MDOC, which id has limit of 10 symbols, so taking last 4 symbols as a year
    // need to retink it in next release
    if (checkForMDocAvailableTypes(documentType, documentID)) {
        filtersArray.push('IMObject eq \'MDOC\'');
        if (dateInfo.dateRangeSwitch) {
            filtersArray.push(getDateFilter(context, 'deliveryDate', dateInfo.odataStartDate, dateInfo.odataEndDate));
        }
        //If nothing is selected, then, by default, we need to search for everything. You can't send an empty query to the backend.
    } else if (documentType.length === 0 || (documentType.length === 1 && documentType[0].ReturnValue === 'ALL')) {
        filtersArray.push('IMObject eq \'ALL\'');
        // adding all available dates to "ALL" query
        if (dateInfo.dateRangeSwitch) {
            filtersArray.push(getDateFilter(context, 'deliveryDate', dateInfo.odataStartDate, dateInfo.odataEndDate));
            filtersArray.push(getDateFilter(context, 'requirementDate', dateInfo.odataStartDate, dateInfo.odataEndDate));
            filtersArray.push(getDateFilter(context, 'createDate', dateInfo.odataStartDate, dateInfo.odataEndDate));
        }
        addOrderIdToSearch = true;
    } else {
        let documentTypeFilters = [];
        if (documentType.length > 0) {
            for (let item of documentType) {
                const IMObject = item.ReturnValue;
                switch (IMObject) {
                    case 'PO':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'deliveryDate', IMObject, dateInfo));
                        break;
                    case 'PR':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'createDate', IMObject, dateInfo));
                        break;
                    case 'IB':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'deliveryDate', IMObject, dateInfo));
                        break;
                    case 'ST':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'deliveryDate', IMObject, dateInfo));
                        break;
                    case 'OB':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'deliveryDate', IMObject, dateInfo));
                        break;
                    case 'MDOC':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'createDate', IMObject, dateInfo));
                        break;
                    case 'RS':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'requirementDate', IMObject, dateInfo));
                        reservationFlag = true;
                        addOrderIdToSearch = true;
                        break;
                    case 'PI':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'createDate', IMObject, dateInfo));
                        break;
                    case 'PRD':
                        documentTypeFilters.push(getDateTypeWrapper(context, 'createDate', IMObject, dateInfo));
                        addOrderIdToSearch = true;
                        break;
                    case 'WO':
                        workOrderFlag = true;
                        addOrderIdToSearch = true;
                        break;
                    default:
                        break;
                }
            }
        }

        /**
         * For online document search by work order, backend requires that we add "IMObject eq 'RS' and OrderId eq '<document id>'" to the query
         * to make backend search work correctly. If "WO" document type is selected, but "RS" (reservation) type is not,
         * then we have to add "IMObject eq 'RS'" to the search query.
         */
        if (!reservationFlag && workOrderFlag) {
            documentTypeFilters.push(getDateTypeWrapper(context, 'requirementDate', 'RS', dateInfo));
        }
        filtersArray.push('(' + documentTypeFilters.join(' or ') + ')');
    }

    if (addOrderIdToSearch && !libVal.evalIsEmpty(documentID)) {
        filtersArray.push(`OrderId eq '${documentID}'`);
    }

    qb.filter('(' + filtersArray.join(' and ') + ')');
    qb.orderBy('ObjectId', 'OrderId', 'IMObject');

    return qb;
}

// checking if order supports MatDocYear search
function checkForMDocAvailableTypes(documentType, documentID) {
    return !libVal.evalIsEmpty(documentID) && documentID.length === 14 && documentID.substring(10, 14) >= 1000 && documentID.substring(10, 14) <= 3000
        && (documentType.length > 0 && (documentType[0].ReturnValue === 'MDOC' || documentType[0].ReturnValue === 'ALL') || documentType.length === 0);
}

// adds date to query options for each type (IMObject) if dateRangeSwitch enavbled
function getDateTypeWrapper(context, type, IMObject, dateInfo) {
    const imFilterLabel = `IMObject eq '${IMObject}'`;
    if (dateInfo.dateRangeSwitch) {
        return `(${imFilterLabel} and ${getDateFilter(context, type, dateInfo.odataStartDate, dateInfo.odataEndDate)})`;
    }
    return imFilterLabel;
}

// returns date query based on passing type
function getDateFilter(context, type, odataStartDate, odataEndDate) {
    let datesArray = [];
    switch (type) {
        case 'deliveryDate':
            datesArray.push(`DelvDateFrom ge datetime'${odataStartDate.toLocalDateString(context)}'`);
            datesArray.push(`DelvDateTo le datetime'${odataEndDate.toLocalDateString(context)}'`);
            break;
        case 'requirementDate':
            datesArray.push(`RequirementDateFrom ge datetime'${odataStartDate.toLocalDateString(context)}'`);
            datesArray.push(`RequirementDateTo le datetime'${odataEndDate.toLocalDateString(context)}'`);
            break;
        case 'createDate':
            datesArray.push(`CrtDateFrom ge datetime'${odataStartDate.toLocalDateString(context)}'`);
            datesArray.push(`CrtDateTo le datetime'${odataEndDate.toLocalDateString(context)}'`);
            break;
        default:
    }
    if (datesArray) {
        return `(${datesArray.join(' and ')})`;
    }
    return '';
}
