
import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema1SR from './GetLastCategorySchema1SR';

export default function ServiceRequestCategoryID1Value(context) {
    return GetLastCategorySchema1SR(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.CategoryID;
        }
        return '';
    });
}
