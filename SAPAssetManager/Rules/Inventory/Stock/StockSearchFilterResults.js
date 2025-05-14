import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function StockSearchFilterResults(context) {
    SetTargetSpecifier(context);
    const clientData = context.evaluateTargetPath('#Page:StockListViewPage/#ClientData');
    const isTodaySwitchValue = context.getControl('FormCellContainer').getControl('IsTodaySwitch').getValue();
    clientData.isForToday = isTodaySwitchValue;

    return GetStockSearchFilterCriteria(context);
}

export function GetStockSearchFilterCriteria(context) {
    const clientData = context.evaluateTargetPath('#Page:StockListViewPage/#ClientData');

    const fcContainer = context.getControl('FormCellContainer');
    const [sortFilterValue, isTodaySwitchValue] = ['SortFilter', 'IsTodaySwitch'].map(n => fcContainer.getControl(n).getValue());
    const [MaterialNumberFilterValues, PlantFilterValues, StorageLocationFilterValues, StorageBinFilterValues, ManufacturerPartNumFilterValues] = ['MaterialNumberFilter', 'PlantFilter', 'StorageLocationFilter', 'StorageBinFilter', 'ManufacturerPartNumFilter']
        .map(n => fcContainer.getControl(n).getFilterValue());

    const filterResults = [sortFilterValue, MaterialNumberFilterValues, PlantFilterValues, StorageLocationFilterValues, StorageBinFilterValues, ManufacturerPartNumFilterValues];

    if (isTodaySwitchValue) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [clientData.todayMaterialsFilter], true));
    }
    return filterResults;
}

function SetTargetSpecifier(context) {
    //Before applying new filters we will set the query options on the list view page to only filter by the user plant so that any new filters can be applied as an AND to the default query
    const pageProxy = context.evaluateTargetPathForAPI('#Page:StockListViewPage');
    const sectionedTable = pageProxy.getControl('SectionedTable');
    const offlineSection = sectionedTable.getSections()[0];
    const targetSpecifier = offlineSection.getTargetSpecifier();

    let query = '$expand=Material/MaterialPlants,MaterialPlant/MaterialBatch_Nav&$orderby=MaterialNum,Plant,StorageLocation';
    const userPlant = CommonLibrary.getUserDefaultPlant();
    if (userPlant) {
        query += `&$filter=Plant eq '${userPlant}'`;
    }

    targetSpecifier.setQueryOptions(query);
    offlineSection.setTargetSpecifier(targetSpecifier);
}
