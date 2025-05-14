import libVal from '../../Common/Library/ValidationLibrary';
import { GetMobileStatusLabelOrNull } from './Details/OperationalItemMobileStatusTextOrEmpty';

export default function OperationalItemsStatus(context) {
    return GetMobileStatusLabelOrNull(context, context.binding)
        .then(labelOrNull => libVal.evalIsEmpty(labelOrNull) ? '-' : labelOrNull);
}
