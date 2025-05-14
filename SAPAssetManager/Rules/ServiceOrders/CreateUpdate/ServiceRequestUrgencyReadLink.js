import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function ServiceRequestUrgencyReadLink(context) {
    const urgency = S4ServiceRequestControlsLibrary.getUrgency(context);
    return `ServiceUrgencySet('${urgency}')`;
}
