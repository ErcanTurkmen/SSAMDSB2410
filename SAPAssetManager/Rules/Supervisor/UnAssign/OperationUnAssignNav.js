import libCom from '../../Common/Library/CommonLibrary';

export default function OperationUnAssignNav(context) {
    libCom.setStateVariable(context, 'IsUnAssign', true);
    libCom.setStateVariable(context, 'IsReAssign', false);
    libCom.setStateVariable(context, 'IsAssign', false);

    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignNav.action');
}
