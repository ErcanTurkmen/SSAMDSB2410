import CommonLibrary from '../../Common/Library/CommonLibrary';
import MeterLibrary from '../Common/MeterLibrary';

export default function GetPlantValue(context) {
    const control = CommonLibrary.getControlProxy(context, 'ReceivingPlantLstPkr');
    return MeterLibrary.getControlValueIfVisible(control);
}
