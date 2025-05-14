import IsNotCompleteAction from '../../WorkOrders/Complete/IsNotCompleteAction';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function IsCancelSelectConfirmationButtonVisible(context) {
    return ServiceConfirmationLibrary.getInstance().getStartPage() === ServiceConfirmationLibrary.itemsFlag && IsNotCompleteAction(context);
}
