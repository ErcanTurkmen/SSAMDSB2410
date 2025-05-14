import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';

export default function ServiceConfirmationItemUpdateNav(context) {
    CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
    ServiceConfirmationLibrary.getInstance().resetAllFlags();
    ServiceConfirmationLibrary.getInstance().setStartPageFlag(ServiceConfirmationLibrary.itemFlag);

    return context.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceConfirmationItemCreateNav.action');
}
