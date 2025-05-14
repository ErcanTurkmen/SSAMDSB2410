import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';
import { getMaterialListPickerConfig } from './MaterialListPickerEntitySet';

export default function PlantListPickerValueChanged(control) {
    ResetValidationOnInput(control);
    let value = control.getValue();
    let data = {};
    let slocQueryOptions = '$orderby=StorageLocation';

    if (value.length > 0) {
        let plant = value[0].ReturnValue;
        data.Plant = plant;
        slocQueryOptions += `&$filter=Plant eq '${plant}' `;
    }

    let config = getMaterialListPickerConfig(data);
    PurchaseRequisitionLibrary.setControlTarget(control, 'MaterialListPicker', config.queryOptions, config.entitySet);
    PurchaseRequisitionLibrary.setControlTarget(control, 'StorageLocationLstPkr', slocQueryOptions);     
}
