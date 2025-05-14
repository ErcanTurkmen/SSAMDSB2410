import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastSQCategorySchema from './GetLastSQCategorySchema';

/**
* Get SchemaID value from the last category selected if exists
* @param {IClientAPI} context
*/
export default function ServiceQuotationSchemaIDValue(context) {
    return GetLastSQCategorySchema(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.SchemaID;
        }
        return '';
    });
}
