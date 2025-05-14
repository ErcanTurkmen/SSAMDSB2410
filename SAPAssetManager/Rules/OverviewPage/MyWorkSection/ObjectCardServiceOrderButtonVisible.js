import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import IsServiceOrderLevel from '../../ServiceOrders/IsServiceOrderLevel';

export default function ObjectCardServiceOrderButtonVisible(context) {
    return IsFSMS4SectionVisible(context) ? IsServiceOrderLevel(context) : false;
}
