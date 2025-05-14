import { Application } from '@nativescript/core';

export let HeaderDescription;
let HeaderDescriptionModule;
/*
This is a sample of how to implement iOS and Android codes separately in a metadata extension.
Because all ts files in metadata Extensions folder will be bundled together using webpack,
if you execute any iOS codes in Android vice versa, it will likely cause issue such as crash.

By splitting the implementation into different files and encapsulate them in a function, it allows
us to load only the required module for the platform at runtime.
*/
if (!HeaderDescription) {
    //Here you will check what platform the app is in at runtime.
    if (Application.ios) {
        //if app is in iOS platform, load the HeaderDescription module from ios folder
        HeaderDescriptionModule = require('./ios/HeaderDescription');
    } else {
        //otherise, assume app is in Android platform, load the HeaderDescription module from android folder
        HeaderDescriptionModule = require('./android/HeaderDescription');
    }
    // calling GetHeaderDescriptionClass() will return HeaderDescription class for the correct platform.
    //  See the HeaderDescription.ts in ios/android folder for details
    HeaderDescription = HeaderDescriptionModule.GetHeaderDescriptionClass();
}
