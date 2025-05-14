import GetLastSQCategorySchema from './GetLastSQCategorySchema';

/**
* Get CodeCatalog value from the last category selected if exists
* @param {IClientAPI} clientAPI
*/
export default function ServiceQuotationCatalogTypeValue(context) {
    return GetLastSQCategorySchema(context).then(schema => {
        return schema?.CodeCatalog || '';
    });
}
