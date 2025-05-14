import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function ServiceConfirmationUpdateNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
    ServiceConfirmationLibrary.getInstance().resetAllFlags();

    let query = '$expand=ServiceConfirmationItems_Nav,RefObjects_Nav/MyEquipment_Nav,RefObjects_Nav/MyFunctionalLocation_Nav,RefObjects_Nav/Material_Nav,Partners_Nav,OrderTransHistory_Nav';
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], query).then(result => {
        context.setActionBinding(result.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationCreateUpdateNav.action');
    });
}
