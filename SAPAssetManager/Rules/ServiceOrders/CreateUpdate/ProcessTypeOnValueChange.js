import ServiceOrderControlsLibrary from '../S4ServiceOrderControlsLibrary';

export default function ProcessTypeOnValueChange(control) {
    ServiceOrderControlsLibrary.updateSalesOrg(control);
    ServiceOrderControlsLibrary.updateServiceOrg(control);
    ServiceOrderControlsLibrary.updateCategories(control);
    ServiceOrderControlsLibrary.updateNoteTypes(control);
}
