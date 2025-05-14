import libCom from '../../Common/Library/CommonLibrary';
import PreloadHierarchyListPickerValues from '../../HierarchyControl/PreloadHierarchyListPickerValues';
import libS4 from '../../ServiceOrders/S4ServiceLibrary';

export default function ServiceQuotationCreateNav(context) {
    //Set the global TransactionType variable to CREATE
    libCom.setOnCreateUpdateFlag(context, 'CREATE');
    libS4.setOnSQChangesetFlag(context, true);

    //set the CHANGSET flag to true
    libCom.setOnChangesetFlag(context, true);
    libCom.resetChangeSetActionCounter(context);
    libCom.setStateVariable(context, 'LocalId', ''); //Reset before starting create
    let binding = context.binding;
    const defaultPriority = libCom.getAppParam(context, 'S4SERVICEORDER', 'Priority');
    const defaultProcessType = libCom.getAppParam(context, 'S4SERVICEQUOTATION', 'ProcessType');

    if (!binding && context.getPageProxy().getActionBinding()) {
        binding = context.getPageProxy().getActionBinding();
    }

    let actionBinding = {
        Priority: defaultPriority,
        ProcessType: defaultProcessType,
    };

    context.getPageProxy().setActionBinding(actionBinding);
    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/ServiceQuotations/CreateUpdate/ServiceQuotationCreateUpdate.page');
    return context.executeAction('/SAPAssetManager/Actions/ServiceQuotation/CreateUpdate/ServiceQuotationsCreateUpdateNav.action');
}
