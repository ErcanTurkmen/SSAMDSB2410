import CommonLibrary from '../Common/Library/CommonLibrary';
import S4RelatedHistoryPendingCount from './S4RelatedHistoryPendingCount';

export default function S4RelatedHistoriesPendingCaption(context) {
    let caption;
    switch (context.getPageProxy().binding.RelatedEntity) {
        case 'S4ServiceOrder':
            caption = 'pending_service_orders';
            break;
        case 'S4ServiceRequest':
            caption = 'pending_service_requests';
            break;
        case 'S4ServiceConfirmation':
            caption = 'pending_confirmations';
            break;
        default:
            caption = '';
            break;
    }

    if (CommonLibrary.getPageName(context) === 'S4RelatedHistoriesPendingListViewPage') {
        return S4RelatedHistoryPendingCount(context).then(count => {
            return `${context.localizeText(caption)} (${count})`;
        });
    } else {
        return context.localizeText(caption);
    }
}
