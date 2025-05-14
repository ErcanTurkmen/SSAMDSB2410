import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function OnServiceOrderValueChanged(control) {
    let value = control.getValue();
    let pageProxy = control.getPageProxy();

    let productControl = CommonLibrary.getControlProxy(pageProxy, 'ProductIdLstPkr');
    let flocControl = CommonLibrary.getControlProxy(pageProxy, 'FuncLocHierarchyExtensionControl');
    let equipmentControl = CommonLibrary.getControlProxy(pageProxy, 'EquipHierarchyExtensionControl');
    flocControl.setEditable(true);
    equipmentControl.setEditable(true);
    productControl.setEditable(true);
    productControl.setValue('');
    flocControl.setData('');
    equipmentControl.setData('');

    if (value) {
        let orderLink = CommonLibrary.getControlValue(control, value);

        control.read('/SAPAssetManager/Services/AssetManager.service', orderLink, [], '$select=Description,Category1,Category2,Category3,Category4&$expand=RefObjects_Nav/Equipment_Nav,RefObjects_Nav/FuncLoc_Nav,RefObjects_Nav/Material_Nav').then(result => {
            if (result.length) {
                let order = result.getItem(0);

                let category1Control = CommonLibrary.getControlProxy(pageProxy, 'Category1LstPkr');
                category1Control.setValue(order.Category1);

                let category2Control = CommonLibrary.getControlProxy(pageProxy, 'Category2LstPkr');
                category2Control.setValue(order.Category2);

                let category3Control = CommonLibrary.getControlProxy(pageProxy, 'Category3LstPkr');
                category3Control.setValue(order.Category3);

                let category4Control = CommonLibrary.getControlProxy(pageProxy, 'Category4LstPkr');
                category4Control.setValue(order.Category4);

                if (order.RefObjects_Nav && order.RefObjects_Nav.length) {
                    order.RefObjects_Nav.forEach(object => {
                        if (object.ProductID) {
                            productControl.setValue(object.ProductID);
                            flocControl.setEditable(false);
                            equipmentControl.setEditable(false);
                        } else if (object.FLocID) {
                            flocControl.setData(object.FLocID);
                            equipmentControl.setEditable(false);
                            productControl.setEditable(false);
                        } else if (object.EquipID) {
                            equipmentControl.setData(object.EquipID);
                            flocControl.setEditable(false);
                            productControl.setEditable(false);
                        }
                    });
                }

                flocControl.reload();
                equipmentControl.reload();

                let formCellContainer = pageProxy.getControl('FormCellContainer');
                formCellContainer.redraw();
            }
        });
    } else {
        flocControl.reload();
        equipmentControl.reload();
    }
}
