import GetPropertyNameForEntity from './GetPropertyNameForEntity';

export default function CategoryFilterPropertyName(context) {
    return GetPropertyNameForEntity(context, 'FilterProperty', 'Category');
}
