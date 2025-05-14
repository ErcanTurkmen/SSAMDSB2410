import OperationalItemsCount from '../WCM/OperationalItems/OperationalItemsCount';

export default function SideDrawerOperationalItemsCount(context) {
    return OperationalItemsCount(context).then((count) => {
        return context.localizeText('operational_items_x', [count]);
    });
}
