import ChangeSetOnSuccess from '../../../Common/ChangeSet/ChangeSetOnSuccess';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default async function ServiceQuotationItemChangeSetOnSuccess(context) {
	try {
		await context.executeAction('/SAPAssetManager/Actions/ServiceQuotations/Items/SetServiceQuotationItemMobileStatusReceived.action');
		await ChangeSetOnSuccess(context);

		CommonLibrary.setStateVariable(context, 'ObjectCreatedName', 'ServiceQuotationItem');
		return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
	} catch (error) {
		Logger.error('ServiceQuotationItemChangeSetOnSuccess', error);
		return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntityFailureMessage.action');
	}
}
