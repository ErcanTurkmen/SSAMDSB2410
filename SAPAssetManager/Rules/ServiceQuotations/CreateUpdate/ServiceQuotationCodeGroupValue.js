import GetLastSQCategorySchema from './GetLastSQCategorySchema';

/**
* Get CodeGroup value from the last category selected if exists
* @param {IClientAPI} clientAPI
*/
export default function ServiceQuotationCodeGroupValue(context) {
    return GetLastSQCategorySchema(context).then(schema => {
        return schema?.CodeGroup || '';
    });
}
