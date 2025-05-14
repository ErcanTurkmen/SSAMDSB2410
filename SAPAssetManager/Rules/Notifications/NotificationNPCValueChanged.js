/**
 *
 * @param {IClientAPI} listPickerProxy
 */
export default function NotificationNPCValueChanged(listPickerProxy) {
    const formCellContainer = listPickerProxy.getPageProxy().getControl('FormCellContainer');
    const selection = listPickerProxy.getValue();
    const typeListPicker = formCellContainer.getControl('TypeLstPkr');
    if (selection.length && selection[0].ReturnValue === '01') { // check if Emergency Work selected
        typeListPicker.setEditable(false);
        typeListPicker.setValue('Y1'); // hardcoding this value for 2402 - use AppParam instead in 2408
    } else {
        typeListPicker.setEditable(true);
        // no need resetting value because it exists in any other types
    }
}
