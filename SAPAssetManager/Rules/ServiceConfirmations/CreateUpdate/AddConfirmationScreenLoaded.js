import ServiceConfirmationLibrary from './ServiceConfirmationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function AddConfirmationScreenLoaded(context) {
    ServiceConfirmationLibrary.getInstance().resetConfirmationDataObject();

    if (context.binding) {
        let objectType = context.binding['@odata.type'];
        if (objectType === '#sap_mobile.S4ServiceOrder' || objectType === '#sap_mobile.S4ServiceItem') {
            let orderLink = `S4ServiceOrders(ObjectID='${context.binding.ObjectID}',ObjectType='${context.binding.ObjectType}')`;
            context.read('/SAPAssetManager/Services/AssetManager.service', orderLink, [], '$expand=RefObjects_Nav').then((result) => {
                if (result.length) {
                    let order = result.getItem(0);
                    setRefObject(context, order.RefObjects_Nav);
                }
            });
        } else if (objectType === '#sap_mobile.S4ServiceConfirmation') {
            context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=RefObjects_Nav').then((result) => {
                if (result.length) {
                    setRefObject(context, result.getItem(0).RefObjects_Nav);
                }
            });
        }
    }
}

function setRefObject(context, refObjects) {
    let flocControl = CommonLibrary.getControlProxy(context, 'FuncLocHierarchyExtensionControl');
    let equipControl = CommonLibrary.getControlProxy(context, 'EquipHierarchyExtensionControl');
    let productControl = CommonLibrary.getControlProxy(context, 'ProductIdLstPkr');

    if (refObjects && refObjects.length) {
        refObjects.forEach(object => {
            if (object.ProductID) {
                productControl.setValue(object.ProductID);
                flocControl.setEditable(false);
                equipControl.setEditable(false);
            } else if (object.FLocID) {
                flocControl.setData(object.FLocID);
                equipControl.setEditable(false);
                productControl.setEditable(false);
            } else if (object.EquipID) {
                equipControl.setData(object.EquipID);
                flocControl.setEditable(false);
                productControl.setEditable(false);
            }
        });
    }
}
