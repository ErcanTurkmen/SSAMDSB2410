import libPersona from '../Persona/PersonaLibrary';

export default function OverviewOnPageReload(context) {
    const overviewPageName = libPersona.getPersonaOverviewStateVariablePage(context);
    context.evaluateTargetPathForAPI('#Page:' + overviewPageName).redraw();
}
