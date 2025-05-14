import { ValueIfExists } from '../../Common/Library/Formatter';
import GetCategoryByProperties from './GetCategoryByProperties';

export default function Category4Value2(context) {
    if (context.binding && context.binding.SchemaID2 && context.binding.CategoryID2) {
        return GetCategoryByProperties(context, '4', context.binding.SchemaID2, context.binding.CategoryID2).then((result) => {
            return ValueIfExists(result.CategoryName);
        });
    } else {
        const category = context.binding.Category4_2_Nav ? context.binding.Category4_2_Nav.CategoryName : null;
        return ValueIfExists(category);
    }
}
