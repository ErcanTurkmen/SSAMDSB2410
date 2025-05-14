import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema from './GetLastCategorySchema';

/**
* Get SchemaID value from the last category selected if exists
* @param {IClientAPI} context
*/
export default function ServiceOrderSchemaIDValue(context) {
    return GetLastCategorySchema(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.SchemaID;
        }
        return '';
    });
}
