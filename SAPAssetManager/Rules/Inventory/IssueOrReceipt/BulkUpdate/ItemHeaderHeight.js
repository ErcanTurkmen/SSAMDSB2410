import { getCurrentFontScale } from '@nativescript/core/accessibility';
import DeviceType from '../../../Common/DeviceType';
import * as application from '@nativescript/core/application';

// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
// Following configurations have been tested in several simulators for iOS and Android of different screen sizes and resolutions.
export default function ItemHeaderHeight(context) {
    const fontScale = getCurrentFontScale();
    const itemHeaderHeightIOS = 70;
    return (application.ios) ? itemHeaderHeightIOS : ItemHeaderHeightAndroid(context, fontScale);
}

function ItemHeaderHeightAndroid(context, fontScale) {
    let height;
    if (DeviceType(context) === 'Phone') {
        if (fontScale >= 1.3) height = 50;
        else if (fontScale >= 1.15) height = 44;
        else height = 40;
    } else {
        if (fontScale >= 1.3) height = 66;
        else if (fontScale >= 1.15) height = 52;
        else if (fontScale >= 1.0) height = 48;
        else if (fontScale >= 0.85) height = 43;
        else height = 35;
    }
    return height;
}
