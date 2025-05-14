import { getCurrentFontScale } from '@nativescript/core/accessibility';
import DeviceType from '../../../Common/DeviceType';
import * as application from '@nativescript/core/application';

// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
// Following configurations have been tested in several simulators for iOS and Android of different screen sizes and resolutions.
export default function SelectAllHeight(context) {
    const fontScale = getCurrentFontScale();
    const selectAllHeightIOS = 44;
    return (application.ios) ? selectAllHeightIOS : SelectAllHeightAndroid(context, fontScale);
}

function SelectAllHeightAndroid(context, fontScale) {
    let height;
    if (DeviceType(context) === 'Phone') {
        if (fontScale >= 1.3) height = 22;
        else if (fontScale >= 1.15) height = 18;
        else height = 16;
    } else {
        if (fontScale >= 1.3) height = 52;
        else if (fontScale >= 1.15) height = 44;
        else if (fontScale >= 1.0) height = 36;
        else if (fontScale >= 0.85) height = 28;
        else height = 20;
    }
    return height;
}
