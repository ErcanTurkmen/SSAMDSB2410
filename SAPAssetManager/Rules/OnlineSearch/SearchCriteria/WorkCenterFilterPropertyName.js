import GetPropertyNameForEntity from './GetPropertyNameForEntity';

export default function WorkCenterFilterPropertyName(context) {
    return GetPropertyNameForEntity(context, 'FilterProperty', 'WorkCenter');
}
