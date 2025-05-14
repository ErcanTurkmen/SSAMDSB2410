import libCom from '../../Common/Library/CommonLibrary';
import { ValueIfExists } from '../../Common/Library/Formatter';
import { ServiceOrderDetailsPageName } from '../ServiceOrderDetailsPageToOpen';

export default function ServiceContractValue(context) {
    let binding = context.getBindingObject();
    let pageName = libCom.getPageName(context);
    const isSODetailsPage = pageName === ServiceOrderDetailsPageName(context);

    if (isSODetailsPage && binding.TransHistories_Nav.length && libCom.isDefined(binding.TransHistories_Nav[0].S4ServiceContract_Nav)) {
        const serviceContract = binding.TransHistories_Nav[0].S4ServiceContract_Nav;
        return `${serviceContract.ObjectID} - ${serviceContract.Description}`;
    }

    if (isSODetailsPage && binding.TransHistories_Nav.length && libCom.isDefined(binding.TransHistories_Nav[0].S4ServiceContractItem_Nav) && libCom.isDefined(binding.TransHistories_Nav[0].S4ServiceContractItem_Nav.Contract_Nav)) {
        const serviceContract = binding.TransHistories_Nav[0].S4ServiceContractItem_Nav.Contract_Nav;
        return `${serviceContract.ObjectID} - ${serviceContract.Description}`;
    }
    return ValueIfExists(binding.ContractAccount);
}
