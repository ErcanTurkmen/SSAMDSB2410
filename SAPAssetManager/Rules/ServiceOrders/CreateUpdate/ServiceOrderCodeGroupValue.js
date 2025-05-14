import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema from './GetLastCategorySchema';

/**
* Get CodeGroup value from the last category selected if exists
* @param {IClientAPI} clientAPI
*/
export default function ServiceOrderCodeGroupValue(context) {
    return GetLastCategorySchema(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.CodeGroup;
        }
        return '';
    });
}
