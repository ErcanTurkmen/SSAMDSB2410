import IsEmergencyWorkEnabled from './IsEmergencyWorkEnabled';
import IsMinorWorkEnabled from './IsMinorWorkEnabled';

export default function IsEmergencyMinorWorkEnabled(context) {
    return IsMinorWorkEnabled(context) || IsEmergencyWorkEnabled(context);
}
