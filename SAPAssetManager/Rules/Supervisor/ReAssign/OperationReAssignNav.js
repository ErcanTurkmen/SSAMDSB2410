import libCom from '../../Common/Library/CommonLibrary';

export default function OperationReAssignNav(context) {
    libCom.setStateVariable(context, 'IsUnAssign', false);
    libCom.setStateVariable(context, 'IsReAssign', true);
    libCom.setStateVariable(context, 'IsAssign', false);

    return context.executeAction('/SAPAssetManager/Actions/Supervisor/Assign/OperationAssignNav.action');
}
