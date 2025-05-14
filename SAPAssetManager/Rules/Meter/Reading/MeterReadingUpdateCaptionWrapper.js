import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import updateCaption from './MeterReadingUpdateCaption';

export default function MeterReadingUpdateCaptionWrapper(context) {
    ResetValidationOnInput(context);
    updateCaption(context.getPageProxy());
}
