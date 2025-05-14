import CommonLibrary from '../../../Common/Library/CommonLibrary';
import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterSettings from '../../../Filter/FilterSettings';

/** @param {IPageProxy} context currently selected tab's pageproxy */
export default function TabPageOnLoaded(context) {
    FilterSettings.applySavedFilterOnList(context);
    const parentPageName = CommonLibrary.getStateVariable(context, 'OperationalItemsListPageName');
    const operationalItemsListPage = context.evaluateTargetPath(`#Page:${parentPageName}`);
    const sectionedTable = context.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    if (sectionedTable === undefined) {  // first page onload: the sectionedtable may not be instantiated
        return;
    }
    FilterLibrary.setFilterActionItemText(context, operationalItemsListPage, sectionedTable);
}
