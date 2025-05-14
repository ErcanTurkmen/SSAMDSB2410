import isWindows from '../Common/IsWindows';

export default function FDCSetEditable(context, contextProxy, ButtonStackLib, ButtonName, section, state) {
    if (isWindows(context)) {
        //Windows uses just a normal MDK button control. It does not have an extension yet.
        section.getControl(ButtonName).setEditable(state);
    } else {
        //iOS & Android platforms use Extensions/ButtonStackModule/ButtonStackLibrary
        ButtonStackLib.setEditable(contextProxy, ButtonName, state);
    }
}
