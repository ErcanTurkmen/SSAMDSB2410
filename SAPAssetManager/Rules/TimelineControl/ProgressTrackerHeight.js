
import { getCurrentFontScale } from '@nativescript/core/accessibility';
import * as application from '@nativescript/core/application';

// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
export default function ProgressTrackerHeight() {
    let fontScale = getCurrentFontScale();
    if (application.ios) {
        if (fontScale >= 4.0) {
            return 480;
        } else if (fontScale >= 3.5) {
            return 440;
        } else if (fontScale >= 3.0) {
            return 350;
        } else if (fontScale >= 2.5) {
            return 300;
        } else if (fontScale >= 2.0) {
            return 240;
        } else if (fontScale >= 1.3) {
            return 200;
        } else if (fontScale >= 1.15) {
            return 155;
        } else if (fontScale >= 1) {
            return 135;
        }
    } else {
        if (fontScale >= 1.3) {
            return 160;
        }
    }
    return 128;
}
