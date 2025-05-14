import {ValueIfExists} from '../../Common/Library/Formatter';
import GetCategoryByProperties from './GetCategoryByProperties';

export default function Category3Value(context) {
    if (context.binding && context.binding.SchemaID && context.binding.CategoryID) {
        return GetCategoryByProperties(context, '3', context.binding.SchemaID, context.binding.CategoryID).then((result) => {
            return ValueIfExists(result.CategoryName);
        });
    } else {
        let category = context.binding.Category3_Nav ? context.binding.Category3_Nav.CategoryName : null;
        return ValueIfExists(category);
    }
}
