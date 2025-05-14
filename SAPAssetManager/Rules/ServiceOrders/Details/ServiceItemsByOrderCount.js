import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceItemsByOrderCount(context) {
    let pageProxy = context.getPageProxy();
    return S4ServiceLibrary.countItemsByOrderId(pageProxy, pageProxy.binding.ObjectID);
}
