import CommonLibrary from '../Common/Library/CommonLibrary';
import S4RelatedHistoryEntitySet from './S4RelatedHistoryEntitySet';

export default function S4RelatedHistoriesPageCaption(context) {
    let caption;
    const entitySet = S4RelatedHistoryEntitySet(context);

    switch (context.binding.RelatedEntity) {
        case 'S4ServiceOrder':
            caption = 'related_service_orders';
            break;
        case 'S4ServiceRequest':
            caption = 'related_service_requests';
            break;
        case 'S4ServiceConfirmation':
            caption = 'related_confirmations';
            break;
        default:
            caption = '';
            break;
    }

    return CommonLibrary.getEntitySetCount(context, entitySet).then(count => {
        return `${context.localizeText(caption)} (${count})`;
    });
}
