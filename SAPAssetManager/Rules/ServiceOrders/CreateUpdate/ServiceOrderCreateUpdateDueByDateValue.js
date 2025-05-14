import SOControlsLib from '../S4ServiceOrderControlsLibrary';

export default function ServiceOrderCreateUpdateDueByDateValue(context) {
    return SOControlsLib.getInitialDueByDate(context);
}
