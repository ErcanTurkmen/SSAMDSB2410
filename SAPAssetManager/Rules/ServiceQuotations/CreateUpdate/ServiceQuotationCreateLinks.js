import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceQuotationControlsLibrary from '../../ServiceOrders/S4ServiceQuotationControlsLibrary';
import ServiceQuotationCategoryLinks from './ServiceQuotationCategoryLinks';

export default function ServiceQuotationCreateLinks(context) {
    const links = ServiceQuotationCategoryLinks(context);

    if (CommonLibrary.IsOnCreate(context)) {
        const priority = S4ServiceQuotationControlsLibrary.getPriority(context);
        const soldToPartyValue = S4ServiceQuotationControlsLibrary.getSoldToParty(context);

        links.create.push({
            'Property': 'Priority_Nav',
            'Target': {
                'EntitySet': 'ServicePriorities',
                'ReadLink': `ServicePriorities('${priority}')`,
            },
        });
            
        links.create.push({
            'Property': 'Customer_Nav',
            'Target': {
                'EntitySet': 'S4BusinessPartners',
                'ReadLink': `S4BusinessPartners('${soldToPartyValue}')`,
            },
        });
    }

    return links.create;
}
