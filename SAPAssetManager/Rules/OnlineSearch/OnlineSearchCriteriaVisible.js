import libNetwork from '../Common/Library/NetworkMonitoringLibrary';
import libSearch from './OnlineSearchLibrary';

/**
* Returns true if there is network connection, otherwise - false
* @param {IClientAPI} context
*/
export default function OnlineSearchCriteriaVisible(context) {
    return libNetwork.isNetworkConnected(context) && !libSearch.isCurrentListInSelectionMode(context);
}
