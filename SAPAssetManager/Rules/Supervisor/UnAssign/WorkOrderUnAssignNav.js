import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderUnAssignNav(context) {
    libCom.setStateVariable(context, 'IsReAssign', false);
    libCom.setStateVariable(context, 'IsAssign', false);
    libCom.setStateVariable(context, 'IsUnAssign', true);

    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignNav.action');
}
