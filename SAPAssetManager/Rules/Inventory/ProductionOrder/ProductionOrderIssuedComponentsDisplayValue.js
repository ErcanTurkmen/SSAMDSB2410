import libCom from '../../Common/Library/CommonLibrary';
/**
* This function returns caption for Issued PRD components alongwith count
* @param {IClientAPI} clientAPI
*/
export default function ProductionOrderIssuedComponentsDisplayValue(clientAPI) {
    
    let baseQuery = "OrderId eq '" + clientAPI.getPageProxy().binding.OrderId + "' and (Completed eq 'X' or (not(RequirementQuantity eq 0 or WithdrawalQuantity eq 0 or RequirementQuantity gt WithdrawalQuantity)))";
    const queryOptions = '$filter=(' + baseQuery + ')';

    return libCom.getEntitySetCount(clientAPI, 'ProductionOrderComponents', queryOptions).then(count => {
        return clientAPI.localizeText('issued_items_x', [count]);
    });
}
