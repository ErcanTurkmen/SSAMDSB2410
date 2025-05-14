import libCommon from '../../Common/Library/CommonLibrary';
import libS4 from '../S4ServiceLibrary';

export default function SericeOrderUpdateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    let query = '$expand=RefObjects_Nav/Material_Nav,RefObjects_Nav/Equipment_Nav,RefObjects_Nav/FuncLoc_Nav';
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], query).then(result => {
        let order = result.getItem(0);
        let refObjectsValues = libS4.getRefObjectsIDsFromBinding(order);
        let actionBinding = Object.assign({}, order, refObjectsValues);
        context.getPageProxy().setActionBinding(actionBinding);
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/CreateUpdate/ServiceOrderCreateUpdateNav.action');
    });
}
