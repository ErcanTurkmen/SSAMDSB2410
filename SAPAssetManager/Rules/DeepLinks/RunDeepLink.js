import ManageDeepLink from './ManageDeepLink';

export default function RunDeepLink(clientAPI) {
	let link = ManageDeepLink.getInstance().getLink();
	let action = Promise.resolve();
	
	switch (link.getActionType()) {
		case 'view':
			action = ManageDeepLink.getInstance().executeViewAction(clientAPI, link);
			break;
		case 'create':
			action = ManageDeepLink.getInstance().executeCreateAction(clientAPI, link);
			break;
		case 'update':
			action = ManageDeepLink.getInstance().executeUpdateAction(clientAPI, link);
			break;
		default:
			break;
	}
	
	return action
		.catch((errorMessage) => {
			if (errorMessage && errorMessage !== 'canceled') {
				return clientAPI.executeAction({
					'Name': '/SAPAssetManager/Actions/DeepLinks/InvalidLinkMessage.action',
					'Properties': {
						'Message': errorMessage.key ? clientAPI.localizeText(errorMessage.key) : errorMessage,
					},
				});
			}
			return Promise.resolve();
		});
}
