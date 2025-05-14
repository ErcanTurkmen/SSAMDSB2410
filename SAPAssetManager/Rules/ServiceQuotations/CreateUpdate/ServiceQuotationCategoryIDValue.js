import GetLastSQCategorySchema from './GetLastSQCategorySchema';

/**
* Get CategoryID value from the last category selected if exists
* @param {IClientAPI} clientAPI
*/
export default function ServiceQuotationCategoryIDValue(context) {
    return GetLastSQCategorySchema(context).then(schema => {
        return schema?.CategoryID || '';
    });
}
