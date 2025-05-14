import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default async function OnCreateServiceQuotationItemServiceContract(context) {
    const serviceContractId = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'ServiceContractLstPkr'));
	
	if (serviceContractId) {
		const serviceContract = await context.read('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceContracts', ['ObjectType'], `$filter=ObjectID eq '${serviceContractId}'`).then((result) => result.getItem(0));
		const quotationObjectID = CommonLibrary.getStateVariable(context, 'LocalId');
		const quotationObjectType = CommonLibrary.getStateVariable(context, 'LocalObjectType');

		return context.executeAction({
			'Name': '/SAPAssetManager/Actions/ServiceQuotations/Items/ServiceQuotationItemTransHistoryCreate.action',
			'Properties': {
				'Properties': {
					'ObjectID': quotationObjectID,
					'ObjectType': quotationObjectType,
					'RelatedObjectID': serviceContractId,
					'RelatedObjectType': serviceContract.ObjectType,
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
						'Property': 'S4ServiceContract_Nav',
						'Target': {
							'EntitySet': 'S4ServiceContracts',
							'ReadLink': `S4ServiceContracts(ObjectID='${serviceContractId}',ObjectType='${serviceContract.ObjectType}')`,
						},
					},
				],
			},
		});
	}
	return Promise.resolve();
}
