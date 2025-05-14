import CommonLibrary from '../../Common/Library/CommonLibrary';
import UpdateContractItemsComponent from '../UpdateContractItemsComponent';
import { updateParentItemControlQueryOptions } from './ParentItemPickerQueryOptions';

/**
* Update service contract list picker options based on selected value
* @param {IClientAPI} control
*/
export default function ServiceOrderValueChanged(control) {
    UpdateContractItemsComponent(control, CommonLibrary.getControlValue(control), undefined, 'contract');
    UpdateContractItemsComponent(control, CommonLibrary.getControlValue(control));
    updateParentItemControlQueryOptions(control);
}
