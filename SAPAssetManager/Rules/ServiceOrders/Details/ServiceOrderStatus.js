import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function ServiceOrderStatus(context) {
    if (context.binding && context.binding.S4ServiceOrder_Nav) {
        let status = MobileStatusLibrary.getMobileStatus(context.binding.S4ServiceOrder_Nav, context);
        return status ? context.localizeText(status) : '-';
    }

    return '-';
}
