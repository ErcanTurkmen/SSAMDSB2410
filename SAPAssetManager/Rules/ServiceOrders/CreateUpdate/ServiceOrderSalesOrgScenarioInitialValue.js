import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* Gets needed properties from binding and gets S4BPSalesAreas readLink to set as initial value for list picker
* @param {IClientAPI} context
*/
export default function ServiceOrderSalesOrgScenarioInitialValue(context) {
    const binding = context.binding;
    if (binding && !CommonLibrary.IsOnCreate(context)) {
        const filterItems = [
            `ProcessType eq '${binding.ProcessType}'`,
            `BusinessPartner eq '${binding.SoldToParty}'`,
            `SalesOrg eq '${binding.SalesOrg}'`,
            `SalesRespOrg eq '${binding.SalesRespOrg}'`,
            `DistributionChannel eq '${binding.DistributionChannel}'`,
            `Division eq '${binding.Division}'`,
            `SalesOffice eq '${binding.SalesOffice}'`,
            `SalesGroup eq '${binding.SalesGroup}'`,
        ];
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'S4BPSalesAreas', [], `$filter=${filterItems.join(' and ')}`).then(result => {
            if (CommonLibrary.isDefined(result)) {
                return result.getItem(0)['@odata.readLink'];
            }
            return '';
        });
    }
    return '';
}
