/**
* Get queries for sold to party
* @param {IClientAPI} clientAPI
*/
export default function GetConfirmationDetailsSoldPartyQuery(context) {
    const expand = '$expand=Address_Nav&$top=1';
    const binding = context.binding;
    if (binding) {
        const parners = binding.Partners_Nav;
        if (parners && parners.length && parners[0].BusinessPartnerID) {
            return `$filter=BPNum eq '${parners[0].BusinessPartnerID}'&${expand}`;
        }
    }
    return `$filter=Customer eq '-1'&${expand}`;
}
