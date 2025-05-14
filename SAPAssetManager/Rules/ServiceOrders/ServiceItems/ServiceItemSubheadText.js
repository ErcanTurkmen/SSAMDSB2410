import { ValueIfCondition } from '../../Common/Library/Formatter';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceItemSubheadText(clientAPI) {
    const binding = clientAPI.binding;
    if (binding) {
        // show NetValue only for Transfer Expence
        if (S4ServiceLibrary.isServiceTravelExpenceItem(clientAPI, binding)) {
            return ValueIfCondition(`${binding.NetValue} ${binding.Currency}`, undefined, binding.NetValue && binding.Currency);
        } else {
            return `${binding.ObjectID || ''}-${binding.ItemNo || ''}`;
        }
    }
    return '';
}
