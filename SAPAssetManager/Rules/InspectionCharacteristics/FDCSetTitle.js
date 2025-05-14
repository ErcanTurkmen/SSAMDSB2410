import isWindows from '../Common/IsWindows';

export default function FDCSetTitle(context, contextProxy, ButtonStackLib, ButtonName, section, text) {
    if (isWindows(context)) {
        //Windows uses just a normal MDK button control. It does not have an extension yet.
        section.getControl(ButtonName).setTitle(text);
    } else {
        //iOS & Android platforms use Extensions/ButtonStackModule/ButtonStackLibrary
        ButtonStackLib.setTitle(contextProxy, ButtonName, text);
    }
}
