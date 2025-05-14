import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import ObjectCardButtonOnPress from './ObjectCardButtonOnPress';

export default function ObjectCardTertiaryButtonOnPress(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getActionBinding();

    if (IsFSMS4SectionVisible(context)) {
        return ObjectCardButtonOnPress(context, binding, ['S']);
    } else {
        return ObjectCardButtonOnPress(context, binding, ['T']);
    }
}
