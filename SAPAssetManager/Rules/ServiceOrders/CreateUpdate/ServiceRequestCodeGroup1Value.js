import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema1SR from './GetLastCategorySchema1SR';

export default function ServiceRequestCodeGroup1Value(context) {
    return GetLastCategorySchema1SR(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.CodeGroup;
        }
        return '';
    });
}
