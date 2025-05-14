import IsInstallMeter from './IsInstallMeter';
import IsNotMeterTakeReadingFlow from './IsNotMeterTakeReadingFlow';

export default function IsConnectionLstPkrVisible(context) {
    return IsNotMeterTakeReadingFlow(context) && IsInstallMeter(context);
}
