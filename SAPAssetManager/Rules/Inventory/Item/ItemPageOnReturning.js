import ItemsData from './ItemsData';
import MaterialDocItemEditVisible from './MaterialDocItemEditVisible';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function ItemPageOnReturning(context) {
    return MaterialDocItemEditVisible(context).then(flag => {
        context.setActionBarItemVisible(0, flag);
        let item = context.getPageProxy().getClientData().item;
        if (item && item['@odata.id'] !== context.binding.item['@odata.id']) {
            return ItemsData(context).then(items => {

                for (let value of items) {
                    if (value['@odata.id'] === item['@odata.id']) {
                        context.getPageProxy().getClientData().item = value;
                    }
                }
                context.getPageProxy().getControl('SectionedTable').redraw();
            });
        }
        return false;
    });
}
