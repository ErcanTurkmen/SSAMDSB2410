import { Application } from '@nativescript/core';

export let SafetyLabel;
let SafetyLabelModule;
/*
By splitting the implementation into different files and encapsulate them in a function, it allows
us to load only the required module for the platform at runtime.

We do this because all of the ts files in the metadata Extensions folder will be bundled together using webpack.
So if you execute any iOS code in Android and vice versa, this will likely result in a crash.
*/
if (!SafetyLabel) {
    // Check what platform the app is in at runtime.
    if (Application.ios) {
        SafetyLabelModule = require('./ios/SafetyLabel');
    } else {
        SafetyLabelModule = require('./android/SafetyLabel');
    }
    // Returns SafetyLabel class for the correct platform.
    SafetyLabel = SafetyLabelModule.GetSafetyLabelClass();
}
