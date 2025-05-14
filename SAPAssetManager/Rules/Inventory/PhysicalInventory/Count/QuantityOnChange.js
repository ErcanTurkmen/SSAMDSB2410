/**
 * replace 0 with empty space
 * @param {IClientAPI} context 
 */
export default function QuantityOnChange(context) {
    if (context._control.getEditable()) {
        if (Number(context._control.getValue()) === 0) {
            context._control.setValue('');
        }
    }
}
