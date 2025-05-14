import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function OnProductIdValueChanged(control) {
    const pageProxy = control.getPageProxy();
    let value = CommonLibrary.getControlValue(control);
    const uomControl = CommonLibrary.getControlProxy(pageProxy, 'UomSimple');
    const timeUnitControl = CommonLibrary.getControlProxy(pageProxy, 'TimeUnitLstPkr');
    const plannedDurationControl = CommonLibrary.getControlProxy(pageProxy, 'PlannedDurationSimple');
    const itemCategoryControl = CommonLibrary.getControlProxy(pageProxy, 'ItemCategoryLstPkr');
    itemCategoryControl.setValue('');

    if (value) {
        control.read('/SAPAssetManager/Services/AssetManager.service', `Materials('${value}')`, [], '$select=BaseUOM').then(result => {
            let baseUom = result.length ? result.getItem(0).BaseUOM : ''; 
            uomControl.setValue(baseUom);

            if (plannedDurationControl && CommonLibrary.getControlValue(plannedDurationControl)) {
                timeUnitControl.setValue(baseUom);
            }

            //resetting the control to reset picker values
            itemCategoryControl.reset().then(() => {
                itemCategoryControl.setEditable(true);  
            });
        });
    } else {
        timeUnitControl.setValue('');
        uomControl.setValue('');
        itemCategoryControl.setEditable(false);
    }
}
