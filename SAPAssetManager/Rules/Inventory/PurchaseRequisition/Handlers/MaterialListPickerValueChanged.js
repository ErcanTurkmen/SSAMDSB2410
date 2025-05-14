import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { SplitReadLink } from '../../../Common/Library/ReadLinkUtils';

/**
 * 
 * @param {ClientAPI} context 
 * @returns 
 */
export default function MaterialListPickerValueChanged(context) {
    ResetValidationOnInput(context);
    let value = context.getValue();
    let valuationTypeQueryOptions = '$orderby=ValuationType';
    
    const storageLocation = GetSLoc(context);

    if (value.length > 0) {
        const materialNum = value[0].ReturnValue;

        let uomValue = '';
        let description = '';
        let storageBin = '';
        let batchIndicatorFlag = false;
        let valuationFlag = false;

        let queryOptions = `$expand=Material,MaterialSLocs&$filter=MaterialNum eq '${materialNum}'`;
        let plant = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context.getPageProxy(), 'PlantLstPkr'));
        if (plant) {
            queryOptions += ` and Plant eq '${plant}'`;
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], queryOptions).then(result => {
            if (result && result.length > 0) {
                let material = result.getItem(0);
   
                uomValue = material.Material ? material.Material.BaseUOM : '';
                description = material.Material ? material.Material.Description : '';
                if (storageLocation) {
                    storageBin = material.MaterialSLocs && material.MaterialSLocs.length ? material.MaterialSLocs.find(k => k.StorageLocation === storageLocation).StorageBin : '';
                }
                if (material.BatchIndicator === 'X') {
                    batchIndicatorFlag = true;
                }
                if (material.ValuationCategory) {
                    valuationFlag = true;
                }
            }

            PurchaseRequisitionLibrary.setControlProperties(context, 'QuantitySimple', '0');
            PurchaseRequisitionLibrary.setControlProperties(context, 'UOMSimple', uomValue);
            PurchaseRequisitionLibrary.setControlProperties(context, 'MaterialDescriptionSimple', description);
            PurchaseRequisitionLibrary.setControlProperties(context, 'StrorageBinSimple', storageBin);
            PurchaseRequisitionLibrary.setControlTarget(context, 'ValuationTypePicker', valuationTypeQueryOptions + `&$filter=Material eq '${materialNum}'`);
            PurchaseRequisitionLibrary.setControlProperties(context, 'MaterialBatch', '', batchIndicatorFlag);

            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialValuations', valuationTypeQueryOptions + `&$filter=Material eq '${materialNum}'`).then(count => {
                PurchaseRequisitionLibrary.setControlProperties(context, 'ValuationTypePicker', '', !!(count) && valuationFlag);
            });
        });
    } else {
        PurchaseRequisitionLibrary.setControlProperties(context, 'QuantitySimple', '0');
        PurchaseRequisitionLibrary.setControlProperties(context, 'UOMSimple', '');
        PurchaseRequisitionLibrary.setControlProperties(context, 'MaterialDescriptionSimple', '');
        PurchaseRequisitionLibrary.setControlProperties(context, 'StrorageBinSimple', '');
        PurchaseRequisitionLibrary.setControlProperties(context, 'MaterialBatch', '', false);
        PurchaseRequisitionLibrary.setControlTarget(context, 'ValuationTypePicker', valuationTypeQueryOptions);
        PurchaseRequisitionLibrary.setControlProperties(context, 'ValuationTypePicker', '', false);
    }
}
/**
 * get the Storage Location value
 * @param {ClientAPI} context 
 */
function GetSLoc(context) {
    const slocLink = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context.getPageProxy(), 'StorageLocationLstPkr'));
    if (slocLink.length > 0) {
        return SplitReadLink(slocLink).StorageLocation;
    }
    return undefined;
}
