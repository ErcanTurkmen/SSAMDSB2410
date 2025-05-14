import libCommon from '../../../Common/Library/CommonLibrary';
import MeterSectionLibrary from '../../../Meter/Common/MeterSectionLibrary';

export default function ActivityDetailsNav(context) {
    const woBinding = MeterSectionLibrary.getWorkOrderBinding(context, context.getPageProxy().binding);
    let queryOption = '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/OrderISULinks';
    return libCommon.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityDetailsNav.action', woBinding.DisconnectActivity_Nav[0]['@odata.readLink'], queryOption);
}
