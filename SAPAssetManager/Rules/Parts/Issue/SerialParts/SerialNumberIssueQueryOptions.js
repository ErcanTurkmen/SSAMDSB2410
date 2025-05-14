import libCom from '../../../Common/Library/CommonLibrary';
import isDefenseEnabled from '../../../Defense/isDefenseEnabled';

export default function SerialNumberIssueQueryOptions(context) {
    let searchString = context.searchString;
    let sloc = context.binding?.StorageLocation;
    let queryBuilder = context.dataQueryBuilder();
    let isDefense = isDefenseEnabled(context);

    if (context.getPageProxy()?.getControl('FormCellContainer')?.getControl('StorageLocationLstPkr')) {
        sloc = libCom.getListPickerValue(context.getPageProxy().evaluateTargetPathForAPI('#Control:StorageLocationLstPkr').getValue());
    }
    const baseQuery = "(Issued eq '' and StorageLocation eq '" + sloc + "')";
    const orderBy = 'SerialNumber';
    let selectFields = 'SerialNumber';

    if (isDefense) selectFields += ',UniqueItemIdentifier';
    queryBuilder.orderBy(orderBy).filter(baseQuery);
    queryBuilder.select(selectFields);
    
    if (searchString) { //Search the serial number and UUID if defense feature enabled
        let searchByProperties = ['SerialNumber'];
        
        if (isDefense) searchByProperties.push('UniqueItemIdentifier');
        queryBuilder.filter().and(queryBuilder.filterTerm(libCom.combineSearchQuery(searchString.toLowerCase(), searchByProperties)));
    }
    
    return queryBuilder;
}
