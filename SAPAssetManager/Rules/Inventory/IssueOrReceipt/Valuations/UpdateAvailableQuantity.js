/**
* The function is updating the available quantity based on valuation type. 
*/
import libCom from '../../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../../Common/Library/ReadLinkUtils';
export default async function UpdateAvailableQuantity(clientAPI) {
        let materialNumControlValue = libCom.getControlProxy(clientAPI.getPageProxy(), 'MaterialLstPkr').getValue()[0].ReturnValue;
        let plantValue = SplitReadLink(materialNumControlValue).Plant;
        let storageLocationValue = SplitReadLink(materialNumControlValue).StorageLocation;
        let materialValue = SplitReadLink(materialNumControlValue).MaterialNum;
        let availableQuantity = clientAPI.getPageProxy().getControl('FormCellContainer').getControl('AvailableQuantity');
        availableQuantity.setValue('0');
        let quantityControl = libCom.getControlProxy(clientAPI.getPageProxy(), 'QuantitySimple');
        let valuationTypeControlValue;
        quantityControl.setEditable(false);
        quantityControl.setValue('');
        try {
                valuationTypeControlValue = clientAPI.getValue()[0].ReturnValue;
                if (valuationTypeControlValue) {
                        let availableQuantityalue = await clientAPI.read('/SAPAssetManager/Services/AssetManager.service', `MaterialBatchStockSet(Plant='${plantValue}',MaterialNum='${materialValue}',StorageLocation='${storageLocationValue}',Batch='${valuationTypeControlValue}')`, [], '');
                        if (availableQuantityalue && availableQuantityalue.length > 0 && availableQuantityalue.getItem(0).UnrestrictedQuantity) {
                                availableQuantity.setValue(availableQuantityalue.getItem(0).UnrestrictedQuantity);
                                quantityControl.setEditable(true);
                                availableQuantity.redraw();
                                quantityControl.redraw();
                        }
                } else {
                        clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', materialNumControlValue, [], '').then(result => {
                                availableQuantity.setValue(result.getItem(0).UnrestrictedQuantity);
                                availableQuantity.redraw();
                            });
                }
            } catch (err) {
                quantityControl.setValue('');
                quantityControl.redraw();
            }
}

