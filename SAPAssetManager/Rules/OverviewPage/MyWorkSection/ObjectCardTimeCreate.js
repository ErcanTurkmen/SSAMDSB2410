import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import ConfirmationCreateFromOperation from '../../Confirmations/CreateUpdate/ConfirmationCreateFromOperation';
import ConfirmationCreateFromWONav from '../../Confirmations/CreateUpdate/ConfirmationCreateFromWONav';

export default function ObjectCardTimeCreate(context) {
    if (IsOperationLevelAssigmentType(context)) {
        if (ConfirmationsIsEnabled(context)) {
            return ConfirmationCreateFromOperation(context);
        } else {
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateNav.action');
        }
    } else {
        if (ConfirmationsIsEnabled(context)) {
            return ConfirmationCreateFromWONav(context);
        } else {
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntryCreateUpdateNav.action');
        }
    }

}
