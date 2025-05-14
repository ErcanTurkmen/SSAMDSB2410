import { getCurrentFontScale } from '@nativescript/core/accessibility';
import * as application from '@nativescript/core/application';

// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
export default function QuickActionBarHeight() {
    let fontScale = getCurrentFontScale();
    let height = 70;

    if (application.ios) {
        if (fontScale >= 4.0) {
            height = 118;
        } else if (fontScale >= 3.5) {
            height = 106;
        } else if (fontScale >= 3.0) {
            height = 95;
        } else if (fontScale >= 2.5) {
            height = 88;
        } else if (fontScale >= 2.0) {
            height = 78;
        } else if (fontScale >= 1.5) {
            height = 75;
        } else if (fontScale >= 1.3) {
            height = 72;
        }
    }
    
    return height;
}
