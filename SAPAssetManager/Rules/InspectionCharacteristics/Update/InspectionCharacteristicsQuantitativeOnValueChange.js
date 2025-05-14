import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import IsWindows from '../../Common/IsWindows';
import FDCSetEditable from '../FDCSetEditable';
import FDCSetTitle from '../FDCSetTitle';

export default function InspectionCharacteristicsQuantitativeOnValueChange(context) {
    ResetValidationOnInput(context);
    let fdcHelper = new FDCSectionHelper(context);
    let section = fdcHelper.findSection(context);
    if (section && Object.prototype.hasOwnProperty.call(section,'index') && section.index !== -1) {
        let index = section.index;
        let binding = section.binding;
        let extensionName;
        let validateButtonName;

        if (deviceType(context) === 'Tablet') {
            extensionName = 'MyExtensionControlName';
            validateButtonName = 'ValidateOrCalculateButtonTablet';
        } else {
            extensionName = 'MyExtensionControlNameValidate';
            validateButtonName = 'ValidateOrCalculateButton';
        }

        let buttonStack = extensionName;
        let contextProxy = IsWindows(context)? '':context.getPageProxy().getControls()[0].sections[index].getControl(buttonStack).getExtension().context.clientAPI;
        if (inspCharLib.isCalculatedAndQuantitative(binding)) {
            FDCSetTitle(context, contextProxy, MyButtonLib,validateButtonName,context.getPageProxy().getControls()[0].sections[index], context.localizeText('calculate'));
            FDCSetEditable(context, contextProxy, MyButtonLib,validateButtonName,context.getPageProxy().getControls()[0].sections[index],true);
            
        } else if (inspCharLib.isQuantitative(binding)) {
            FDCSetTitle(context, contextProxy, MyButtonLib, validateButtonName, context.getPageProxy().getControls()[0].sections[index], context.localizeText('validate'));
            FDCSetEditable(context, contextProxy, MyButtonLib, validateButtonName, context.getPageProxy().getControls()[0].sections[index],true);
            
        }
    }
}
