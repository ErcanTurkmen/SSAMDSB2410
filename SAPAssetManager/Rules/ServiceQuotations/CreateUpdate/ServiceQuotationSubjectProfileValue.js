import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastSQCategorySchema from './GetLastSQCategorySchema';

/**
* Get SubjectProfile value from the last category selected if exists
* @param {IClientAPI} clientAPI
*/
export default function ServiceQuotationSubjectProfileValue(context) {
    return GetLastSQCategorySchema(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.SubjectProfile;
        }
        return '';
    });
}
