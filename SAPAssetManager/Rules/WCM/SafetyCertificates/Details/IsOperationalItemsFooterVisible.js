import OperationalItemsCount from '../../OperationalItems/OperationalItemsCount';

export default function IsOperationalItemsFooterVisible(context) {
    return OperationalItemsCount(context).then(count => {
        return count > 4;
    });
}
