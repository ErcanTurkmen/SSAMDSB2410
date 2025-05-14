import S4ServiceItemStatusLibrary from '../S4ServiceItemStatusLibrary';

export default function OperationConfirmStatus(context) {
    return S4ServiceItemStatusLibrary.confirmServiceItem(context);
}
