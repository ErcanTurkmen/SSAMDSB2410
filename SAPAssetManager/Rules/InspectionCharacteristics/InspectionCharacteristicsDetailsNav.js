import common from '../../Rules/Common/Library/CommonLibrary';

export default function InspectionCharacteristicsDetailsNav(context) {
    let binding = context.getActionResult('ReadResult').data.getItem(0);
    common.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/InspectionCharacteristics/InspectionCharacteristicsDetails.action', `${binding['@odata.readLink']}`, '$expand=MasterInspChar_Nav,NotifItems_Nav,InspectionMethod_Nav,InspectionMethod_Nav/MethodDoc_Nav,InspectionMethod_Nav/MethodDoc_Nav/Document_Nav,InspectionMethod_Nav/MethodLongText_Nav');
}
