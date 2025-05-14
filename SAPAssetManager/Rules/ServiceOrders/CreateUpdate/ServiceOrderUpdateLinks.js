import S4ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';
import ServiceOrderCategoryLinks from './ServiceOrderCategoryLinks';

export default function ServiceOrderUpdateLinks(context) {
    const priority = S4ServiceOrderControlsLibrary.getPriority(context);
    let { update } = ServiceOrderCategoryLinks(context);

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
