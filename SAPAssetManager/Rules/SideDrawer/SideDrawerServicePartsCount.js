import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';

export default function SideDrawerServicePartsCount(context) {
    let categories = S4ServiceLibrary.getServiceProductPartCategories(context);
    return S4ServiceLibrary.countItemsByCategory(context, categories)
        .then(count => {
            return context.localizeText('parts_x', [count]);
        })
        .catch(() => {
            return context.localizeText('parts_x', [0]);
        });
}
