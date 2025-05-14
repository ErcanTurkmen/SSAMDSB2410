import { addCategorizationSchemaLink } from '../../ServiceOrders/CreateUpdate/ServiceOrderCategoryLinks';
import S4ServiceQuotationControlsLibrary from '../../ServiceOrders/S4ServiceQuotationControlsLibrary';

export default function ServiceQuotationCategoryLinks(context) {
    const binding = context.binding || {};
    const category1 = S4ServiceQuotationControlsLibrary.getCategory(context, 'Category1LstPkr');
    const category2 = S4ServiceQuotationControlsLibrary.getCategory(context, 'Category2LstPkr');
    const category3 = S4ServiceQuotationControlsLibrary.getCategory(context, 'Category3LstPkr');
    const category4 = S4ServiceQuotationControlsLibrary.getCategory(context, 'Category4LstPkr');
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
