import * as application from '@nativescript/core/application';
export let ImageView;
let ImageViewModule;

if (!ImageView) {
    if (application.ios) {
        ImageViewModule = require('./ios/ImageView');
    } else {
        ImageViewModule = require('./android/ImageView');
    }
    ImageView = ImageViewModule.GetImageViewClass();
}
