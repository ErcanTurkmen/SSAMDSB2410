import libSearch from './OnlineSearchLibrary';

export default function SelectAllButtonVisible(context) {
    // multi-select mode is disabled for 2410 release
    return false && libSearch.selectDeselectButtonVisible(context, true);
}
