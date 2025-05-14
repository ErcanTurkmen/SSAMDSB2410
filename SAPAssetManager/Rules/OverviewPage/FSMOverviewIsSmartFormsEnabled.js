import isWindows from '../Common/IsWindows';
import smartFormsEnabled from '../Forms/FSM/SmartFormsFeatureIsEnabled';
export default function FSMOverviewIsSmartFormsEnabled(context) {
    return (smartFormsEnabled(context) && isWindows(context));
}
