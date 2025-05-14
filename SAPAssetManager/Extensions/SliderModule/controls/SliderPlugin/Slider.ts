import * as application from '@nativescript/core/application';
export let Slider;
let SliderModule;

if (!Slider) {
    if (application.ios) {
        SliderModule = require('./ios/Slider');
    } else {
        SliderModule = require('./android/Slider');
    }
    Slider = SliderModule.GetSliderClass();
}
