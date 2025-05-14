import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';
import isWindows from '../../Common/IsWindows';

export default function InspectionCharacteristicsValidateOrCalculateIsEditable(context) {

    let binding = context.binding;
    let validateButtonName = deviceType(context) === 'Tablet' ? 'ValidateOrCalculateButtonTablet' : 'ValidateOrCalculateButton';

    if (context.binding.Valuation === 'A') {
        if (!isWindows(context)) {
            MyButtonLib.setTitle(context, validateButtonName, context.localizeText('validated'));
            MyButtonLib.setEditable(context, validateButtonName, false);
        }
        
        return false;
    }

    return (inspCharLib.isCalculatedAndQuantitative(binding) || inspCharLib.isQuantitative(binding));
}
