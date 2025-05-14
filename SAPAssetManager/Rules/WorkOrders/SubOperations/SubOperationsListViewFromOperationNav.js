import libSubOpMobile from '../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';

export default function SubOperationsListViewFromOperationNav(context) {
    return libSubOpMobile.isAnySubOperationStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationsListViewNav.action');
    });
}
