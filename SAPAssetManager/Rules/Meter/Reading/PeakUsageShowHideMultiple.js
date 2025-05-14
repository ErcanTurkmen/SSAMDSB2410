import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import {GetSectionForControl} from '../../FDC/DynamicPageGenerator';

export default function PeakUsageShowHideMultiple(context) {
    ResetValidationOnInput(context);

    const section = GetSectionForControl(context);
    let peakTimeControl = section.getControl('PeakUsageTimeControl');

    if (!peakTimeControl) {
        peakTimeControl = context.getPageProxy().getControls()[0]._control.controls.find(function(entity) {
            return entity.controlProxy.getName() === 'PeakUsageTimeControl' + context.getName().substr(context.getName().length - 4);
        });
    }

    peakTimeControl.setVisible(context.getValue());
}
