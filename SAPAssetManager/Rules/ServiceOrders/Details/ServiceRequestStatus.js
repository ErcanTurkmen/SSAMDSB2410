import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function ServiceRequestStatus(context) {
    if (context.binding && context.binding.S4ServiceRequest_Nav) {
        let status = MobileStatusLibrary.getMobileStatus(context.binding.S4ServiceRequest_Nav, context);
        return status ? context.localizeText(status) : '-';
    }

    return '-';
}
