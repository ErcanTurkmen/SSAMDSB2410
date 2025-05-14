import SoftInputModeConfig from '../../Common/SoftInputModeConfig';
import IsAndroid from '../../Common/IsAndroid';

export default function EDTSoftInputModeConfig(context) {
    if (IsAndroid(context)) {
        // eslint-disable-next-line no-undef
        SoftInputModeConfig(context.getPageProxy(), android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
    }
}
