import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';
import ServiceOrderCategoryLinks from './ServiceOrderCategoryLinks';

export default function ServiceOrderCreateLinks(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        const priority = S4ServiceOrderControlsLibrary.getPriority(context);
        const soldToPartyValue = S4ServiceOrderControlsLibrary.getSoldToParty(context);
        const category1 = S4ServiceOrderControlsLibrary.getCategory(context, 'Category1LstPkr');
        const category2 = S4ServiceOrderControlsLibrary.getCategory(context, 'Category2LstPkr');
        const category3 = S4ServiceOrderControlsLibrary.getCategory(context, 'Category3LstPkr');
        const category4 = S4ServiceOrderControlsLibrary.getCategory(context, 'Category4LstPkr');
        let links = [
            {
                'Property': 'Priority_Nav',
                'Target': {
                    'EntitySet': 'ServicePriorities',
                    'ReadLink': `ServicePriorities('${priority}')`,
                },
            },
            {
                'Property': 'Customer_Nav',
                'Target': {
                    'EntitySet': 'S4BusinessPartners',
                    'ReadLink': `S4BusinessPartners('${soldToPartyValue}')`,
                },
            },
        ];

        addCategorizationSchemaLink(category1, 'Category1_Nav', links);
        addCategorizationSchemaLink(category2, 'Category2_Nav', links);
        addCategorizationSchemaLink(category3, 'Category3_Nav', links);
        addCategorizationSchemaLink(category4, 'Category4_Nav', links);

        return links;
    } else {
        let links = ServiceOrderCategoryLinks(context);
        return links.create;
    }
}

function addCategorizationSchemaLink(guid, property, links) {
    if (CommonLibrary.isDefined(guid)) {
        links.push({
            'Property': property,
            'Target': {
                'EntitySet': 'CategorizationSchemas',
                'QueryOptions': `$filter=CategoryGuid eq guid'${guid}'`,
            },
        });
    }
}
