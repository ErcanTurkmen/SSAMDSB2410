import CommonLibrary from '../Common/Library/CommonLibrary';

export default function SyncErrorCloseIsVisible(context) {
    let previousPage = CommonLibrary.getPreviousPageName(context);
    return !(previousPage === 'ErrorArchiveAndSync' || context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SlideOutMenu);
}
