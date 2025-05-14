import ChangeSetOnSuccess from '../../Common/ChangeSet/ChangeSetOnSuccess';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

export default async function ServiceQuotationChangeSetOnSuccess(context) {
	try {
		await ChangeSetOnSuccess(context);
		CommonLibrary.setStateVariable(context, 'ObjectCreatedName', 'ServiceQuotation');
		await context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
	} catch (error) {
		Logger.error('ServiceQuotationChangeSetOnSuccess', error);
		return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
	}

	try {
		await context.executeAction('/SAPAssetManager/Actions/MobileStatus/MobileStatusServiceQuotationSetReceived.action');
		await context.executeAction('/SAPAssetManager/Actions/ServiceQuotations/Items/SetServiceQuotationItemMobileStatusReceived.action');
	} catch (error) {
		Logger.error('ServiceQuotationChangeSetOnSuccess', error);
		return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
	}

	return Promise.resolve();
}
