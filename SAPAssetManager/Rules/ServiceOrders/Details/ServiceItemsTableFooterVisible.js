import S4ServiceLibrary from '../S4ServiceLibrary';

export default async function ServiceItemsTableFooterVisible(context) {
    let pageProxy = context.getPageProxy();
    const count = await S4ServiceLibrary.countItemsByOrderId(pageProxy, pageProxy.binding.ObjectID);

    return count > 1;
}
