import libCommon from '../../Common/Library/CommonLibrary';
import libS4 from '../S4ServiceLibrary';
import PreloadHierarchyListPickerValues from '../../HierarchyControl/PreloadHierarchyListPickerValues';

export default function ServiceOrderCreateNav(context) {
    //Set the global TransactionType variable to CREATE
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libS4.setOnSOChangesetFlag(context, true);

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    libCommon.setStateVariable(context, 'LocalId', ''); //Reset before starting create
    let binding = context.binding;
    const defaultPriority = libCommon.getAppParam(context, 'S4SERVICEORDER', 'Priority');
    const defaultProcessType = libCommon.getAppParam(context, 'S4SERVICEORDER', 'ProcessType');

    if (!binding && context.getPageProxy().getActionBinding()) {
        binding = context.getPageProxy().getActionBinding();
    }

    let actionBinding = {
        Priority: defaultPriority,
        ProcessType: defaultProcessType,
    };

    if (libCommon.isDefined(binding)) {
        let { HeaderEquipment, HeaderFunctionLocation, Product } = libS4.getRefObjectsIDsFromBinding(binding);
        actionBinding.HeaderEquipment = HeaderEquipment;
        actionBinding.HeaderFunctionLocation = HeaderFunctionLocation;
        actionBinding.Product = Product;
        actionBinding.Description = binding.Description;
        actionBinding.ObjectID = binding.ObjectID;
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
            actionBinding.Priority = binding.Priority === '0' ? defaultPriority : binding.Priority;
            actionBinding.SoldToParty = binding.SoldToParty;
            actionBinding.SalesOrg = binding.SalesOrg;
            actionBinding.BillToParty = binding.BillToParty;
            actionBinding.ServiceOrg = binding.ServiceOrg;
        }
        if (binding['@odata.type'] === '#sap_mobile.S4ServiceOrderPartner') {
            actionBinding.SoldToParty = binding.BusinessPartnerID;
        }
        if (binding['@odata.type'] === '#sap_mobile.MyEquipment') {
            actionBinding.HeaderEquipment = binding.EquipId;
        }
        if (binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
            actionBinding.HeaderFunctionLocation = binding.FuncLocIdIntern;
        }
    }

    context.getPageProxy().setActionBinding(actionBinding);
    PreloadHierarchyListPickerValues(context, '/SAPAssetManager/Pages/ServiceOrders/CreateUpdate/ServiceOrderCreateUpdate.page');
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceOrderCreateChangeSet.action');
}
