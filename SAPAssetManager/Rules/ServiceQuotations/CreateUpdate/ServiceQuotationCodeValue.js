import GetLastSQCategorySchema from './GetLastSQCategorySchema';

/**
* Get Code value from the last category selected if exists
* @param {IClientAPI} clientAPI
*/
export default function ServiceQuotationCodeValue(context) {
    return GetLastSQCategorySchema(context).then(schema => {
        return schema?.Code || '';
    });
}
