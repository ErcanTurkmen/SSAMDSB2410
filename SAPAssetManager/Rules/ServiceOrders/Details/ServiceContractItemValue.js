import libCom from '../../Common/Library/CommonLibrary';

export default function ServiceContractItemValue(context) {
    let binding = context.getBindingObject();
    if (libCom.isDefined(binding.TransHistories_Nav.S4ServiceContractItem_Nav)) {
        const serviceContract = binding.TransHistories_Nav.S4ServiceContractItem_Nav;
        return `${serviceContract.ObjectID} - ${serviceContract.Description}`;
    }
    return '-';
}
