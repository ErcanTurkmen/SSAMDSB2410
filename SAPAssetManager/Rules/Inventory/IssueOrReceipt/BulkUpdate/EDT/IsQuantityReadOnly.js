import IsQuantityEditable from '../../../Validation/IsQuantityEditable';

export default function IsQuantityReadOnly(context) {
    return IsQuantityEditable(context).then((editable) => {
        return !editable;
    });
}
