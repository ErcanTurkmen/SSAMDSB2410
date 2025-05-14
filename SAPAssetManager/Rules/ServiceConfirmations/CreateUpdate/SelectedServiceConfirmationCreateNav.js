import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceConfirmationItemCreateNav from './ServiceConfirmationItemCreateNav';

export default function SelectedServiceConfirmationCreateNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();

    CommonLibrary.setStateVariable(pageProxy, 'LocalId', actionBinding.ObjectID);
    ServiceConfirmationLibrary.getInstance().setConfirmationLink(actionBinding['@odata.readLink']);

    if (ServiceConfirmationLibrary.getInstance().getActionPage() === ServiceConfirmationLibrary.itemHocFlag) {
        return pageProxy.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/Item/ServiceHocConfirmationItemCreateNav.action');
    } else if (ServiceConfirmationLibrary.getInstance().getActionPage() === ServiceConfirmationLibrary.itemFlag) {
        return ServiceConfirmationItemCreateNav(pageProxy, pageProxy.binding);
    } else {
        return pageProxy.executeAction('/SAPAssetManager/Actions/ServiceConfirmations/ServiceConfirmationSelectItemNav.action');
    }
}
