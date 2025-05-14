import CommonLibrary from '../../../Common/Library/CommonLibrary';
import GetServiceItemObjectType from '../../../ServiceItems/CreateUpdate/Data/GetServiceItemObjectType';

export default async function OnCreateServiceQuotationItemServiceContractItem(context) {
    const serviceContractId = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceContractLstPkr'));
	const itemObjectType = await GetServiceItemObjectType(context);
	const serviceContractItemNo = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceContractItemLstPkr'));
	
	if (serviceContractItemNo && itemObjectType && serviceContractId) {
		const serviceContractItem = await context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceContractItems', ['ObjectType', 'ItemObjectType'], `$filter=ObjectID eq '${serviceContractId}' and ItemNo eq '${serviceContractItemNo}'`).then((result) => result.getItem(0));
		return context.executeAction({
			'Name': '/SAPAssetManager/Actions/ServiceQuotations/Items/ServiceQuotationItemTransHistoryCreate.action',
			'Properties': {
				'Properties': {
					'RelatedObjectID': serviceContractId,
					'RelatedObjectType': serviceContractItem.ItemObjectType,
					'RelatedItemNo': serviceContractItemNo,
				},
				'CreateLinks': [
					{
						'Property': 'S4ServiceItem_Nav',
						'Target': {
							'EntitySet': 'S4ServiceQuotationItems',
							'ReadLink': '/SAPAssetManager/Rules/ServiceQuotations/Items/CreateUpdate/Data/GetServiceQuotationItemLink.js',
						},
					},
					{
						'Property': 'S4ServiceContractItem_Nav',
						'Target': {
							'EntitySet': 'S4ServiceContractItems',
							'ReadLink': `S4ServiceContractItems(ItemNo='${serviceContractItemNo}',ObjectID='${serviceContractId}',ObjectType='${serviceContractItem.ObjectType}')`,
						},
					},
				],
			},
		});
	}
	return Promise.resolve();
}
