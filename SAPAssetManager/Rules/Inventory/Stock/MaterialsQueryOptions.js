import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function MaterialsQueryOptions(context) {
    const stockOnLineSearch = context.evaluateTargetPathForAPI('#Page:StockListViewPage').getClientData().StockOnLineSearch;
    const stockOnLine = context.evaluateTargetPathForAPI('#Page:StockListViewPage').getClientData().StockOnLine;

    if (!libVal.evalIsEmpty(stockOnLineSearch) && stockOnLineSearch) {
        let queryBuilder = context.dataQueryBuilder();

        let newFilterOpts = [];
        if (stockOnLine.Plant.length > 0) {
            let plantsQuery = [];
            for (let i in stockOnLine.Plant) {
                if (!libVal.evalIsEmpty(stockOnLine.Plant[i])) {
                    plantsQuery.push(`Plant eq '${stockOnLine.Plant[i].ReturnValue}'`);
                }
            }
            if (plantsQuery.length > 0) {
                newFilterOpts.push(`(${plantsQuery.join(' or ')})`);
            }
        }
        if (stockOnLine.StorageLocation.length > 0) {
            let storageLocationsQuery = [];
            for (let i in stockOnLine.StorageLocation) {
                if (!libVal.evalIsEmpty(stockOnLine.StorageLocation[i])) {
                    storageLocationsQuery.push(`StorageLocation eq '${stockOnLine.StorageLocation[i].ReturnValue}'`);
                }
            }
            if (storageLocationsQuery.length > 0) {
                newFilterOpts.push(`(${storageLocationsQuery.join(' or ')})`);
            }
        }
        if (!libVal.evalIsEmpty(stockOnLine.MaterialID)) {
            newFilterOpts.push(`MaterialNum eq '${stockOnLine.MaterialID}'`);
        }
        if (!libVal.evalIsEmpty(stockOnLine.MaterialDescription)) {
            newFilterOpts.push(`substringof('${stockOnLine.MaterialDescription.toLowerCase()}', MaterialDesc)`);
        }       
        if (!libVal.evalIsEmpty(stockOnLine.ManufacturerPartNum)) {
            newFilterOpts.push(`ManufacturerPartNum eq '${stockOnLine.ManufacturerPartNum}'`);
        }
        if (!libVal.evalIsEmpty(stockOnLine.StorageBin)) {
            newFilterOpts.push(`StorageBin eq '${stockOnLine.StorageBin}'`);
        }
        queryBuilder.filter(newFilterOpts.join(' and '));
        queryBuilder.expand('Material');
        return queryBuilder;
    }

    return '$filter=false';
}
