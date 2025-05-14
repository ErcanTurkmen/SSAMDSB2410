import { getCurrentFontScale } from '@nativescript/core/accessibility';
import DeviceType from '../Common/DeviceType';
import * as application from '@nativescript/core/application';

// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
export default function SectionHeaderHeight(context, buttonCount) {
    let fontScale = getCurrentFontScale();
    let height = 110;

    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            let baseLineDiff = 0;
            if (fontScale >= 4.0) {
                baseLineDiff = 197 + 2 * 8;
            } else if (fontScale >= 3.5) {
                baseLineDiff = 155 + 2 * 8;
            } else if (fontScale >= 3.0) {
                baseLineDiff = 128 + 2 * 8;
            } else if (fontScale >= 2.5) {
                baseLineDiff = 91 + 2 * 4;
            } else if (fontScale >= 2.0) {
                baseLineDiff = 59;
            } else if (fontScale >= 1.5) {
                baseLineDiff = 29;
            } else if (fontScale >= 1.3) {
                baseLineDiff = 14;
            } else if (fontScale >= 1.15) {
                baseLineDiff = 8;
            }

            if (buttonCount === 0) {
                height = 104 + baseLineDiff + 2 * 8;
            } else if (buttonCount === 1) {
                height = 152 + baseLineDiff + 2 * 8;
            }  else if (buttonCount === 2) {
                height = 200 + baseLineDiff + 2 * 8;
            }
        } else {
            if (fontScale >= 4.0) {
                height = 189 + 2 * 16;
            } else if (fontScale >= 3.5) {
                height = 170 + 2 * 16; 
            } else if (fontScale >= 3.0) {
                height = 152 + 2 * 16;
            } else if (fontScale >= 2.5) {
                height = 134 + 2 * 12;
            } else if (fontScale >= 2.0) {
                height = 117 + 2 * 8;
            } else if (fontScale >= 1.5) {
                height = 100 + 2 * 8;
            } else if (fontScale >= 1.3) {
                height = 93 + 2 * 8;
            } else if (fontScale >= 1.15) {
                height = 88 + 2 * 8;
            } else if (fontScale >= 1.0) {
                height = 81 + 2 * 8;
            } else if (fontScale >= 0.85) {
                height = 76 + 2 * 8;
            } else {
                height = 74 + 2 * 8;
            }
        }
    } else {
        if (DeviceType(context) === 'Phone') {
            let baseLineDiff = 0;
            if (fontScale >= 1.3) {
                baseLineDiff = 14;
            } else if (fontScale >= 1.15) {
                baseLineDiff = 8;
            }
            
            if (buttonCount === 0) {
                height = 104 + baseLineDiff + 2 * 8;
            } else if (buttonCount === 1) {
                height = 152 + baseLineDiff + 2 * 8;
            }  else if (buttonCount === 2) {
                height = 200 + baseLineDiff + 2 * 8;
            }
        } else {
            if (fontScale >= 1.3) {
                height = 93 + 2 * 8;
            } else if (fontScale >= 1.15) {
                height = 88 + 2 * 8;
            } else if (fontScale >= 1.0) {
                height = 81 + 2 * 8;
            } else if (fontScale >= 0.85) {
                height = 76 + 2 * 8;
            } else {
                height = 74 + 2 * 8;
            }
        }
    }

    return height;
}
