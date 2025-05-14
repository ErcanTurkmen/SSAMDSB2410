import CommonLibrary from '../../Common/Library/CommonLibrary';
import nilGuid from '../../Common/nilGuid';
import S4ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';

export default function ServiceOrderCategoryLinks(context) {
    const binding = context.binding;
    const category1 = S4ServiceOrderControlsLibrary.getCategory(context, 'Category1LstPkr');
    const category2 = S4ServiceOrderControlsLibrary.getCategory(context, 'Category2LstPkr');
    const category3 = S4ServiceOrderControlsLibrary.getCategory(context, 'Category3LstPkr');
    const category4 = S4ServiceOrderControlsLibrary.getCategory(context, 'Category4LstPkr');
    let links = {
        create: [],
        update: [],
        delete: [],
    };

    addCategorizationSchemaLink(category1, binding.Category1, 'Category1_Nav', links);
    addCategorizationSchemaLink(category2, binding.Category2, 'Category2_Nav', links);
    addCategorizationSchemaLink(category3, binding.Category3, 'Category3_Nav', links);
    addCategorizationSchemaLink(category4, binding.Category4, 'Category4_Nav', links);

    return links;
}

export function addCategorizationSchemaLink(selectedValue, bindingValue, property, links) {
    const emptyGuid = nilGuid();
    const bindingValueExists = CommonLibrary.isDefined(bindingValue) && bindingValue !== emptyGuid;
    const categoryLink = {
        'Property': property,
        'Target': {
            'EntitySet': 'CategorizationSchemas',
            'QueryOptions': `$filter=CategoryGuid eq guid'${selectedValue || bindingValue}'`,
        },
    };

    /* if value is selected and category also exists in the binding, it's an update
    * if category doesn't exist in the binding, it's a create
    * if value is not selected, but category exists in the binding, this means user deselected the category. do a delete 
    * */
    if (CommonLibrary.isDefined(selectedValue)) {
        if (bindingValueExists) {
            links.update.push(categoryLink);
        } else {
            links.create.push(categoryLink);
        }
    } else if (bindingValueExists) {
        links.delete.push(categoryLink);
    }
}
