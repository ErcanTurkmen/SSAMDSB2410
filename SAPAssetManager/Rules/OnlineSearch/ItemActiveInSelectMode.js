import libSearch from './OnlineSearchLibrary';

export default function ItemActiveInSelectMode(context) {
    // multi-select mode is disabled for 2410 release
    return false && libSearch.isCurrentListInSelectionMode(context);
}
