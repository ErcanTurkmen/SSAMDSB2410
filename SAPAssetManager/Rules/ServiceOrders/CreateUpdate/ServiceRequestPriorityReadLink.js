import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function ServiceRequestPriorityReadLink(context) {
    const priority = S4ServiceRequestControlsLibrary.getPriority(context);
    return `ServicePriorities('${priority}')`;
}
