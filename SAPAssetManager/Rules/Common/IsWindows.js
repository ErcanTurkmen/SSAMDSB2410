export default function IsWindows(/** @type {IClientAPI} */ context) {
    return !!context.nativescript?.applicationModule?.windows;
}
