import { getCurrentFontScale } from '@nativescript/core/accessibility';
import DeviceType from '../../../Common/DeviceType';
import * as application from '@nativescript/core/application';

// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
// Following configurations have been tested in several simulators for iOS and Android of different screen sizes and resolutions.
export default function EDTHeight(context) {
    let fontScale = getCurrentFontScale();
    let height;

    if (application.ios) {
        if (fontScale >= 2.0) height = 95;
        else if (fontScale >= 1.5) height = 75;
        else if (fontScale >= 1.3) height = 64;
        else if (fontScale >= 1.15) height = 60;
        else height = 54;
    } else {
        height = DeviceType(context) === 'Phone' ? 53 : 49;
    }
    return height;
}

export function EDTColumnWidth(context) {
    let ItemEDTColWidth;
    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 90,
                sloc: 90,
                qty: 80,
                uom: 85,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 100,
                sloc: 220,
                qty: 200,
                uom: 180,
                btn: 10,
            };
        }

    } else {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 100,
                sloc: 90,
                qty: 80,
                uom: 85,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 100,
                sloc: 220,
                qty: 200,
                uom: 180,
                btn: 10,
            };
        }
    }
    return ItemEDTColWidth;
    
}
