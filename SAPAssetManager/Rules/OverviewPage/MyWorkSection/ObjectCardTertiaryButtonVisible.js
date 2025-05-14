import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import ObjectCardButtonVisible from './ObjectCardButtonVisible';

export default function ObjectCardTertiaryButtonVisible(context) {
    if (IsFSMS4SectionVisible(context)) {
        return ObjectCardButtonVisible(context, ['S', 'N'], true);
    } else {
        return ObjectCardButtonVisible(context, ['T']);
    }
}
