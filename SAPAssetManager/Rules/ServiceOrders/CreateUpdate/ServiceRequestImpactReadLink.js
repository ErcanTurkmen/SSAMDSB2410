import S4ServiceRequestControlsLibrary from '../S4ServiceRequestControlsLibrary';

export default function ServiceRequestImpactReadLink(context) {
    const impact = S4ServiceRequestControlsLibrary.getImpact(context);
    return `ServiceImpactSet('${impact}')`;
}
