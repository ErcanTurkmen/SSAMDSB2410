import libSearch from './OnlineSearchLibrary';

/**
* Returns list epmty section caption. If we are in selection mode and there are no item to download, returns empty string
* @param {IClientAPI} context
*/
export default function EmptySectionCaption(context) {
    return libSearch.isCurrentListInSelectionMode(context) ?
        '' :
        context.localizeText('online_search_no_results_msg');
}
