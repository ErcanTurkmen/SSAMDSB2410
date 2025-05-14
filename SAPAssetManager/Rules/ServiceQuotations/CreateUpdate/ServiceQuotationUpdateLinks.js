import S4ServiceQuotationControlsLibrary from '../../ServiceOrders/S4ServiceQuotationControlsLibrary';
import ServiceQuotationCategoryLinks from './ServiceQuotationCategoryLinks';

export default function ServiceQuotationUpdateLinks(context) {
    const priority = S4ServiceQuotationControlsLibrary.getPriority(context);
    let { update } = ServiceQuotationCategoryLinks(context);

    return [
        {
            'Property': 'Priority_Nav',
            'Target': {
                'EntitySet': 'ServicePriorities',
                'ReadLink': `ServicePriorities('${priority}')`,
            },
        },
        ...update,
    ];
}
