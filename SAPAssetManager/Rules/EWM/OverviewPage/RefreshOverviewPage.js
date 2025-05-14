import libCom from '../../Common/Library/CommonLibrary';
import { ResetTasksInPageData } from '../WarehouseTask/Details/TaskArray';

/**
* Handle the refresh of the overview page
* @param {IClientAPI} clientAPI
*/
export default function RefreshOverviewPage(clientAPI) {
    ResetTasksInPageData(clientAPI.getPageProxy());
    libCom.redrawPageSection(clientAPI, 'EWMOverviewPage', 'SectionedTable');
}
