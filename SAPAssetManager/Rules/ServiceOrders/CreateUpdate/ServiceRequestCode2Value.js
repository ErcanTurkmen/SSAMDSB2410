import CommonLibrary from '../../Common/Library/CommonLibrary';
import GetLastCategorySchema2SR from './GetLastCategorySchema2SR';

export default function ServiceRequestCode2Value(context) {
    return GetLastCategorySchema2SR(context).then(schema => {
        if (CommonLibrary.isDefined(schema)) {
            return schema.Code;
        }
        return '';
    });
}
