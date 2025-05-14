import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function OnItemCategoryValueChanged(control) {
    let value = CommonLibrary.getControlValue(control);
    let serviceControl1 = CommonLibrary.getControlProxy(control.getPageProxy(), 'StartDatePkr');
    let serviceControl2 = CommonLibrary.getControlProxy(control.getPageProxy(), 'StartTimePkr');
    let serviceControl3 = CommonLibrary.getControlProxy(control.getPageProxy(), 'TimeUnitLstPkr');
    let serviceControl4 = CommonLibrary.getControlProxy(control.getPageProxy(), 'PlannedDurationSimple');
    let serviceControl5 = CommonLibrary.getControlProxy(control.getPageProxy(), 'ServiceTypeLstPkr');
    let serviceControl6 = CommonLibrary.getControlProxy(control.getPageProxy(), 'ValuationTypeLstPkr');

    let nonServiceControl1 = CommonLibrary.getControlProxy(control.getPageProxy(), 'CurrencyLstPkr');
    let nonServiceControl2 = CommonLibrary.getControlProxy(control.getPageProxy(), 'AmountProperty');

    nonServiceControl1.setVisible(false);
    nonServiceControl2.setVisible(false);
    serviceControl1.setVisible(false);
    serviceControl2.setVisible(false);
    serviceControl3.setVisible(false);
    serviceControl4.setVisible(false);
    serviceControl5.setVisible(false);
    serviceControl6.setVisible(false);

    if (value) {
        control.read('/SAPAssetManager/Services/AssetManager.service', `ServiceItemCategories('${value}')`, [], '$select=ObjectType').then(result => {
            if (result.length && result.getItem(0).ObjectType) {
                let serviceItemCategories = S4ServiceLibrary.getServiceProductItemCategories(control.getPageProxy());
                let isServiceItem = serviceItemCategories.includes(result.getItem(0).ObjectType);

                nonServiceControl1.setVisible(!isServiceItem);
                nonServiceControl2.setVisible(!isServiceItem);
                serviceControl1.setVisible(isServiceItem);
                serviceControl2.setVisible(isServiceItem);
                serviceControl3.setVisible(isServiceItem);
                serviceControl4.setVisible(isServiceItem);
                serviceControl5.setVisible(isServiceItem);
                serviceControl6.setVisible(isServiceItem);
            }
        });
    }

    let category4Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'Category4LstPkr');
    let category3Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'Category3LstPkr');
    let category2Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'Category2LstPkr');
    let category1Control = CommonLibrary.getControlProxy(control.getPageProxy(), 'Category1LstPkr');
    category4Control.reset();
    category3Control.reset();
    category2Control.reset();
    category1Control.reset();
}
