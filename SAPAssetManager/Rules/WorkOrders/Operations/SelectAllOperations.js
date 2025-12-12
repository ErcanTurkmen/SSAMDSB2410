import { redrawToolbar } from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import OperationsEntitySet from './OperationsEntitySet';
import WorkOrderOperationListViewCaption from './WorkOrderOperationListViewCaption';
import WorkOrderOperationsListViewQueryOption from './WorkOrderOperationsListViewQueryOption';
import Logger from '../../Log/Logger';

export default async function SelectAllOperations(context) {
    CommonLibrary.setStateVariable(context, 'selectAllActive', true, 'WorkOrderOperationsListViewPage');
    CommonLibrary.setStateVariable(context, 'removedOperations', []);
    const pageProxy = context.getPageProxy();
    const table = pageProxy.getControls()[0].getSections()[0];
    table.selectAllItems();

    pageProxy.showActivityIndicator();
    //manually add all items to the array
    Logger.error("Poonam Select all");
    let selectedOperations = await addAllRecords(context);
    CommonLibrary.setStateVariable(context, 'selectedOperations', selectedOperations);
    pageProxy.dismissActivityIndicator();

    redrawToolbar(context);

    pageProxy.setActionBarItemVisible('SelectAll', false);
    pageProxy.setActionBarItemVisible('DeselectAll', true);

    return WorkOrderOperationListViewCaption(context).then(caption => {
         Logger.error("Poonam Select all caption", caption);
        return pageProxy.setCaption(caption);
    });
}

async function addAllRecords(context) {
    //This needs to be done because MDK will only have information about the object cells that have been loaded by the user. By default the paging size is 50.
    //So we would only get 50 as the selected rows even if there are several more. So in order to get around that we will manually read the records from the db
    //and maintain the list ourselves
    Logger.error("Poonam addAllRecords");
    let queryOptions = await getTableFilters(context);
    let selectedOperations = [];
    if (queryOptions) {
         Logger.error("Poonam addAllRecords queryOptions", queryOptions);
        const totalRecords = await context.count('/SAPAssetManager/Services/AssetManager.service', OperationsEntitySet(context), queryOptions);
        const batchSize = 50;
        let recordsAlreadyRead = selectedOperations.length;

        while (recordsAlreadyRead < totalRecords) {
            const recordsToRead = Math.min(batchSize, totalRecords - recordsAlreadyRead); //Read max 50 at a time instead of all at once for performance reasons
            const recordsReadByBatch = await context.read('/SAPAssetManager/Services/AssetManager.service', OperationsEntitySet(context), [], `${queryOptions}&$skip=${recordsAlreadyRead}&$top=${recordsToRead}`);

            //convert the array to be a collection of SelectedItem objects to mimic what the getSelectedItems() API does
            for (let i=0; i < recordsReadByBatch.length; i++) {
                let currentRecord = recordsReadByBatch.getItem(i);
                selectedOperations.push({
                    binding: currentRecord,
                });
            }

            recordsAlreadyRead += recordsReadByBatch.length;
            if (recordsReadByBatch.length < batchSize) { // All rows are read
                return selectedOperations;
            }
        }
    }

    return selectedOperations;
}

async function getTableFilters(context) {
    const sectionedTable = context.getPageProxy().getControls()[0];
     Logger.error("Poonam sectionedTable", sectionedTable);
    let filterQuery = '';
    let expandQuery = '';
    let tableQueryOptions = WorkOrderOperationsListViewQueryOption(sectionedTable);
    Logger.error("Poonam tableQueryOptions", tableQueryOptions);
    let quickFilters = CommonLibrary.getQueryOptionFromFilter(context);
Logger.error("Poonam quickFilters", quickFilters);
    if (tableQueryOptions && tableQueryOptions.hasFilter) {
        const filter = await tableQueryOptions.filterOption.build();
        filterQuery = '$filter=' + filter;
    }

    if (tableQueryOptions && tableQueryOptions.hasExpand) {
        const expand = await tableQueryOptions.expandOption.join(',');
        expandQuery = '&$expand=' + expand;
    }

    if (quickFilters) {
        if (filterQuery) {
            filterQuery += ' and ' + quickFilters.substring(8);
        } else {
            filterQuery = quickFilters;
        }
    }
    Logger.error("Poonam filterQuery", filterQuery);
    return `${filterQuery}${expandQuery}`;
}
