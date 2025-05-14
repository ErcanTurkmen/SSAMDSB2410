import NativeScriptObject from './Library/NativeScriptObject';

export default function IsAndroid(context) {
    return NativeScriptObject.getNativeScriptObject(context).platformModule.isAndroid;
}
