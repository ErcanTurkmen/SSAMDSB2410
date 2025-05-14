import CommonLibrary from '../Common/Library/CommonLibrary';
import S4RelatedHistoryRecentCount from './S4RelatedHistoryRecentCount';

export default function S4RelatedHistoriesRecentCaption(context) {
    let caption;
    switch (context.getPageProxy().binding.RelatedEntity) {
        case 'S4ServiceOrder':
            caption = 'previous_service_orders';
            break;
        case 'S4ServiceRequest':
            caption = 'previous_service_requests';
            break;
        case 'S4ServiceConfirmation':
            caption = 'previous_confirmations';
            break;
        default:
            caption = '';
            break;
    }

    if (CommonLibrary.getPageName(context) === 'S4RelatedHistoriesRecentListViewPage') {
        return S4RelatedHistoryRecentCount(context).then(count => {
            return `${context.localizeText(caption)} (${count})`;
        });
    } else {
        return context.localizeText(caption);
    }
}
