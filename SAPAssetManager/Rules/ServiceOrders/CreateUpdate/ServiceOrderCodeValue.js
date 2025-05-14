import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema from './GetLastCategorySchema';

/**
* Get Code value from the last category selected if exists
* @param {IClientAPI} clientAPI
*/
export default function ServiceOrderCodeValue(context) {
    return GetLastCategorySchema(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.Code;
        }
        return '';
    });
}
