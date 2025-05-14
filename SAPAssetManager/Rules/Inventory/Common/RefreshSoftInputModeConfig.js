import IsAndroid from '../../Common/IsAndroid';
import SoftInputModeConfig from '../../Common/SoftInputModeConfig';

//Set soft input mode to allow scroll of form when keyboard is on --> MDKBUG-1655
export default function RefreshSoftInputModeConfig(clientAPI) {
    if (IsAndroid(clientAPI)) {
        // eslint-disable-next-line no-undef
        SoftInputModeConfig(clientAPI, android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
    }
}
