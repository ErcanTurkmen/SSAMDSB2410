import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import WOPriorityStatusStyle from '../../Priority/WOPriorityStatusStyle';
import S4PriorityStatusStyle from '../../Priority/S4PriorityStatusStyle';

export default function ObjectCardPriorityStyle(context) {
    return IsFSMS4SectionVisible(context) ? S4PriorityStatusStyle(context) : WOPriorityStatusStyle(context);
}
