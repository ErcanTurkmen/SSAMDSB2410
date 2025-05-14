import IsNotCompleteAction from '../../WorkOrders/Complete/IsNotCompleteAction';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function IsCancelConfirmationItemButtonVisible(context) {
    return IsNotCompleteAction(context) && (
        ServiceConfirmationLibrary.getInstance().getStartPage() === ServiceConfirmationLibrary.itemHocFlag || 
        ServiceConfirmationLibrary.getInstance().getStartPage() === ServiceConfirmationLibrary.itemFlag
        );
}
