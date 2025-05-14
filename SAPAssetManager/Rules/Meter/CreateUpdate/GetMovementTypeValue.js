import CommonLibrary from '../../Common/Library/CommonLibrary';
import MeterLibrary from '../Common/MeterLibrary';

export default function GetMovementTypeValue(context) {
    const movementTypeControl = CommonLibrary.getControlProxy(context, 'MovementTypeLstPkr');
    return MeterLibrary.getControlValueIfVisible(movementTypeControl);
}
