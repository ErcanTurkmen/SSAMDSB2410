import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';

export default function SideDrawerServiceItemsCount(context) {
    return S4ServiceLibrary.countAllS4ServiceItems(context)
        .then(count => {
            return context.localizeText('items_list_title_count', [count]);
        }).catch(() => {
            return context.localizeText('items_list_title_count', [0]);
        });
}
