
import ConfirmationCreateUpdateNav from './ConfirmationCreateUpdateNav';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default async function ConfirmationCreateFromWONav(context) {

    let postingDate;
    let binding = context.getBindingObject();
    if (binding) {
        postingDate = binding.PostingDate;
    } else {
        binding = context.getPageProxy().getActionBinding();
    }
    let currentDate = new Date();
    let odataDate = new ODataDate(currentDate);

    if (postingDate) { //The user is viewing the confirmations for a workorder after selecting a particular day from the Labor facet
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        if (hours < 10) hours = `0${hours}`;
        if (minutes < 10) minutes = `0${minutes}`;
        let timeStr = `${hours}:${minutes}:00`;
        odataDate = new ODataDate(postingDate, timeStr);
    }
    const openOperations = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [],
        await libMobile.getQueryOptionsForCompletedStatusForOperations(context, binding.OrderId));
    const override = {
        'WorkOrderHeader': binding,
        'OrderID': binding.OrderId,
        'OperationNo': openOperations?.getItem(0)?.OperationNo,
        'IsWorkOrderChangable': false,
        'PostingDate': odataDate,
    };

    if (binding.MainWorkCenterPlant !== undefined) {
        override.Plant = binding.MainWorkCenterPlant;
    }

    return libSuper.checkReviewRequired(context, binding).then(review => {
        if (review && !libMobile.isSubOperationStatusChangeable(context)) { //If not sub-operation assignment and needs review, then don't allow final confirmation to be set by user
            override.IsFinalChangable = false;
        }
        return ConfirmationCreateUpdateNav(context, override, odataDate.date(), odataDate.date());
    });
}
