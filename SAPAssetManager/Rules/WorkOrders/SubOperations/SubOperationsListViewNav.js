import libCom from '../../Common/Library/CommonLibrary';
import libSubOpMobile from '../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';

export default function OperationsListViewNav(context) {
    libCom.setStateVariable(context,'FromSubOperationsList', true);
    return libSubOpMobile.isAnySubOperationStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationsListViewNav.action');
    });
}
