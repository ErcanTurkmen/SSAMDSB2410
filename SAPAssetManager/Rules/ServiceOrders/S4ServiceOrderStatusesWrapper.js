import S4ServiceLibrary from './S4ServiceLibrary';

export default function S4ServiceOrderStatusesWrapper(context, actionBinding) {
    return S4ServiceLibrary.getAvailableStatusesServiceOrder(context, actionBinding);
}
