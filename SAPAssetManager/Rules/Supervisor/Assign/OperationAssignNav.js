import libCom from '../../Common/Library/CommonLibrary';

export default function OperationAssignNav(context) {
    libCom.setStateVariable(context, 'IsUnAssign', false);
    libCom.setStateVariable(context, 'IsReAssign', false);
    libCom.setStateVariable(context, 'IsAssign', true);

    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignNav.action');
}
