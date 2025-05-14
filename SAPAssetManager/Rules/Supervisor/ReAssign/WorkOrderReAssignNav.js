import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderReAssignNav(context) {
    libCom.setStateVariable(context, 'IsUnAssign', false);
    libCom.setStateVariable(context, 'IsAssign', false);
    libCom.setStateVariable(context, 'IsReAssign', true);

    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignNav.action');
}
