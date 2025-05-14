
import { getMaterialDescription } from '../../Common/EWMLibrary';

export default function WarehouseTaskTitle(context) {
    if (!context.binding.Product) {
        return Promise.resolve('');
    }
    return getMaterialDescription(context).then(description => {
        return [context.binding.Product, description].filter(i => !!i).join(' - ');
    });
}
