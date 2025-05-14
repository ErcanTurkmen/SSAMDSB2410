/* eslint-disable no-undef */
import { Application, Utils } from '@nativescript/core';

export default class {
    static openUrl(location) {
        if (Application.ios) {
            const url = NSURL.URLWithString(location.trim());
            if (UIApplication.sharedApplication.canOpenURL(url)) {
                return UIApplication.sharedApplication.openURLOptionsCompletionHandler(url, null, null);
            } else {
                return false;
            }
        } else {
            return Utils.openUrl(location);
        }
    }
}
