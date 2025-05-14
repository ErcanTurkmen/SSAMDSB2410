import SOControlsLib from '../S4ServiceOrderControlsLibrary';

export default function ServiceOrderCreateUpdateDueBySwitchOnChange(context) {
    return SOControlsLib.dueBySwitchOnChange(context);
}
