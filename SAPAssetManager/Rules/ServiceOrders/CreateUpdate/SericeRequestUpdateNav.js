import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function SericeRequestUpdateNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceRequestCreateUpdateNav.action');
}
