import s4 from './IsS4ServiceIntegrationEnabled';

export default function IsS4ServiceIntegrationNotEnabled(context) {
    return !(s4(context));
}
