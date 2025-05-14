import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function OnDurationValueChanged(control) {
    const pageProxy = control.getPageProxy();
    const value = CommonLibrary.getControlValue(control);
   
    const timeUnitControl = CommonLibrary.getControlProxy(pageProxy, 'TimeUnitLstPkr');
    const productIdControl = CommonLibrary.getControlProxy(pageProxy, 'ProductIdLstPkr');
    const productId = CommonLibrary.getControlValue(productIdControl);

    if (value && productId) {
        control.read('/SAPAssetManager/Services/AssetManager.service', `Materials('${productId}')`, [], '$select=BaseUOM').then(result => {
            const baseUom = result.length ? result.getItem(0).BaseUOM : ''; 
            timeUnitControl.setValue(baseUom);
            timeUnitControl.setEditable(true);
        });
    } else {
        timeUnitControl.setValue('');
        timeUnitControl.setEditable(false);
    }
}
