import { ValueIfExists } from '../../Common/Library/Formatter';
import GetCategoryByProperties from './GetCategoryByProperties';

export default function Category1Value2(context) {
    if (context.binding && context.binding.SchemaID2 && context.binding.CategoryID2) {
        return GetCategoryByProperties(context, '1', context.binding.SchemaID2, context.binding.CategoryID2).then((result) => {
            return ValueIfExists(result.CategoryName);
        });
    } else {
        const category = context.binding.Category1_2_Nav ? context.binding.Category1_2_Nav.CategoryName : null;
        return ValueIfExists(category);
    }
}
