import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Return an option to refresh only if user downloads from details page
* @param {IClientAPI} context
*/
export default function CompletionActionLabel(context) {
    if (CommonLibrary.getPageName(context).includes('Details')) {
        return context.localizeText('tap_to_refresh');
    }
    return '';
}
