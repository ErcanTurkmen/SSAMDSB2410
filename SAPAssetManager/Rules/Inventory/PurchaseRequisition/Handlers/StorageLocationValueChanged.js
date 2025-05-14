import { SplitReadLink } from '../../../Common/Library/ReadLinkUtils';
import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';
import { getMaterialListPickerConfig } from './MaterialListPickerEntitySet';

export default function StorageLocationValueChanged(control) {
    let value = control.getValue();
    let data = {};

    if (value.length > 0) {
        const slocLink = value[0].ReturnValue;
        data = SplitReadLink(slocLink);
    }

    let config = getMaterialListPickerConfig(data);
    PurchaseRequisitionLibrary.setControlTarget(control, 'MaterialListPicker', config.queryOptions, config.entitySet);
}
