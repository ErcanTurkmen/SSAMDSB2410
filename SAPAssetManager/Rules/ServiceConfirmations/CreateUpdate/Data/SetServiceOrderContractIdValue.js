import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function SetServiceOrderContractIdValue(context) {
    const binding = context.binding;
    if (binding) {
        if (binding.S4ServiceOrder_Nav && binding.S4ServiceOrder_Nav.TransHistories_Nav) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', binding.S4ServiceOrder_Nav.TransHistories_Nav[0]['@odata.id'], [], '$select=S4ServiceContract_Nav/ObjectID&$expand=S4ServiceContract_Nav').then(data => {
                if (data && data.length) {
                    const serviceContract = data.getItem(0).S4ServiceContract_Nav;
                    return serviceContract.ObjectID;
                }
                return '';
            });
        } else {
            return ValueIfExists(binding.ContractID);
        }
    }

    return '';
}
