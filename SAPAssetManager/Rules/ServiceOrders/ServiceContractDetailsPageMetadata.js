import ModifyKeyValueSection from '../LCNC/ModifyKeyValueSection';

export default async function ServiceContractDetailsPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/ServiceOrders/ServiceContractDetails.page');
    return await ModifyKeyValueSection(clientAPI, page, 'ContractDetailsSection');
}
