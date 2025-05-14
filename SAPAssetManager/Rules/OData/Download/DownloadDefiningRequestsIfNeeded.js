/**
* Trigger the defining requests if in the overview page
* so that we could refresh the page again if needed.
* @param {IClientAPI} clientAPI
*/
import DownloadDefiningRequest from './DownloadDefiningRequest';
export default function DownloadDefiningRequestsIfNeeded(clientAPI) {
    if (clientAPI.currentPage.parent.definition.name.includes('SideDrawer')) { // parent will be side menu if we are on overview
        DownloadDefiningRequest(clientAPI);
    }
}
