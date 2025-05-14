import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema from './GetLastCategorySchema';

/**
* Get SubjectProfile value from the last category selected if exists
* @param {IClientAPI} clientAPI
*/
export default function ServiceOrderSubjectProfileValue(context) {
    return GetLastCategorySchema(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.SubjectProfile;
        }
        return '';
    });
}
