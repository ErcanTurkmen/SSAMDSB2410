import WOFastFilters from '../../../FastFilters/MultiPersonaFilters/WOFastFilters';
import isDefenseEnabled from '../../../Defense/isDefenseEnabled';
import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default async function WorkOrderFastFiltersItems(context) {
    let WOFastFiltersClass = new WOFastFilters(context);

    libCom.removeStateVariable(context, 'flightOrderTypesFilter');
    if (isDefenseEnabled(context)) { //Add flight orders filter button
        let flightOrderTypesFilter = await getFlightOrderTypes(context);
        if (flightOrderTypesFilter) libCom.setStateVariable(context, 'flightOrderTypesFilter', flightOrderTypesFilter);
    }
    return prepareDataForFastFilters(context, WOFastFiltersClass).then(() => {
        /** 
            to customize the list of fast filters, the getFastFilters method must be overwritten in the WOFastFilters class
            getFastFilters returns a list of filter objects
            each object contains:
            for filters: filter name, filter value, filter property (if the value is not a complex query), filter group (combines multiple filters with "or"), visible
            for sortes: caption, value, visible
         */
        return WOFastFiltersClass.getFastFilterItemsForListPage(context);
    });
}

function prepareDataForFastFilters(context, WOFastFiltersClass) {
    let promises = [];

    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderDocuments', ['OrderId', 'OperationNo'], '$filter=sap.hasPendingChanges()'));    
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaderLongTexts', ['OrderId'], '$filter=sap.hasPendingChanges()'));
    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', 'PMMobileStatuses', ['OrderId'], '$filter=sap.hasPendingChanges() and sap.entityexists(WOHeader_Nav)'));

    return Promise.all(promises).then(results => {
        context.getPageProxy().getClientData().WOFastFiltersClass = WOFastFiltersClass;

        let ids = [];
        addPendingSyncObjectsId(results[0], ids);
        addPendingSyncObjectsId(results[1], ids);
        addPendingSyncObjectsId(results[2], ids);
     
        if (ids.length) {
            let query = ids.join(' or ');
            WOFastFiltersClass.setConfigProperty('modifiedFilterQuery', query);
        }

        return Promise.resolve();
    });
}

function addPendingSyncObjectsId(pendingObjects, ids) {
    if (pendingObjects.length) {
        pendingObjects.forEach(pendingObject => {
            if (pendingObject.OrderId && !pendingObject.OperationNo) {
                ids.push(`OrderId eq '${pendingObject.OrderId}'`);
            }
        });
    }
}

/**
 * Read the flight order types and create a filter string
 * @param {*} context 
 * @returns 
 */
async function getFlightOrderTypes(context) {
    try {
        let types = await context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['OrderType'], "$filter=IsFlightType eq 'X'");
        if (types && types.length > 0) {
            let typesQueryStrings = types.map(type => {
                return `OrderType eq '${type.OrderType}'`;
            });
            return `(${typesQueryStrings.join(' or ')})`;
        }
        return '';
    } catch (error) {
        Logger.error('WorkOrderFastFiltersItems', `Flight order types read error: ${error}`);
        return '';
    }
}
