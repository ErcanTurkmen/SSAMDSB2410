import {ValueIfExists} from '../../Common/Library/Formatter';
import GetCategoryByProperties from './GetCategoryByProperties';

export default function Category2Value(context) {
    if (context.binding && context.binding.SchemaID && context.binding.CategoryID) {
        return GetCategoryByProperties(context, '2', context.binding.SchemaID, context.binding.CategoryID).then((result) => {
            return ValueIfExists(result.CategoryName);
        });
    } else {
        let category = context.binding.Category2_Nav ? context.binding.Category2_Nav.CategoryName : null;
        return ValueIfExists(category);
    }
}
