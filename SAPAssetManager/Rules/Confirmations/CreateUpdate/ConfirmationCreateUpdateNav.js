import libCommon from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import PreloadHierarchyListPickerValues from '../../HierarchyControl/PreloadHierarchyListPickerValues';

export default function ConfirmationCreateUpdateNav(context, override, defaultStart = new Date(), defaultEnd = new Date(), ignoreChangeset = false) {

    let mConfirmation = {
        '_Start': defaultStart,
        '_End': defaultEnd,
        'IsOnCreate': true,
        'IsWorkOrderChangable': true,
        'IsOperationChangable': true,
        'IsSubOperationChangable': true,
        'IsDateChangable': true,
        'IsFinalChangable': true,
        'SubOperation': '',
        'VarianceReason': '',
        'AccountingIndicator': '',
        'ActivityType': '',
        'Description': '',
        'Operation': '',
        'OrderID': '',
        'Plant': '',
        'IsFinal': false,
        'WorkOrderHeader': undefined,
        'name': 'mConfirmation',
        '_Posting': defaultStart,
    };

    if (override) {
        for (const [key, value] of Object.entries(override)) {
            mConfirmation[key] = value;
        }
    }

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    context.getPageProxy().setActionBinding(mConfirmation);
    ///CreateUpdateConfirmation needs confirmation args in client data
    context.getClientData().confirmationArgs = mConfirmation;
    libCommon.setStateVariable(context, 'FinalConfirmationIsCompletingWorkOrder', false);
    libCommon.removeStateVariable(context, 'LAMConfirmationNum');
    libCommon.removeStateVariable(context, 'LAMConfirmationCounter');
    libCommon.removeStateVariable(context, 'LAMDefaultRow');
    libCommon.removeStateVariable(context, 'LAMCreateType');
    libCommon.removeStateVariable(context, 'LAMConfirmationReadLink');
    libCommon.removeStateVariable(context, 'LAMSignature'); //Set to true before displaying signature screen during confirmation add
    libCommon.removeStateVariable(context, 'LAMConfirmCreate');  //Set to true if confirmation LAM entry needs to be deferred until after signature entry
    libCommon.setStateVariable(context, 'ConfirmationCreation', true);

    // at the time of completion, only the page should be open without creating a changeset
    let action = '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateChangeset.action';
    if (IsCompleteAction(context) || ignoreChangeset) {
        action = '/SAPAssetManager/Actions/Confirmations/ConfirmationsCreateUpdateNav.action';
    }
    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/Confirmations/ConfirmationsCreateUpdate.page');
    return context.executeAction(action);
}
