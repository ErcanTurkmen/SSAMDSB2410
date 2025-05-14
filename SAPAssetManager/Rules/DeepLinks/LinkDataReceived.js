import IsAndroid from '../Common/IsAndroid';
import ManageDeepLink from './ManageDeepLink';
import RunDeepLink from './RunDeepLink';
import Logger from '../Log/Logger';

export default async function LinkDataReceived(clientAPI) {
	return setTimeout(() => {
		ManageDeepLink.getInstance().init(clientAPI)
			.then(() => {
				return checkCurrentOpenedPage(clientAPI);
			})
			.catch((errorMessage) => {
				if (errorMessage && errorMessage !== 'canceled') {
					return clientAPI.executeAction({
						'Name': '/SAPAssetManager/Actions/DeepLinks/InvalidLinkMessage.action',
						'Properties': {
							'Message': errorMessage.key ? clientAPI.localizeText(errorMessage.key) : errorMessage,
						},
					});
				}
				Logger.error('LinkDataReceived', errorMessage);
				return Promise.resolve();
			});
	}, IsAndroid(clientAPI) ? 3000 : 0); //Waits until the android app initialized
}

function checkCurrentOpenedPage(clientAPI) {
	if (clientAPI.currentPage && clientAPI.currentPage.isModal()) {
		return clientAPI.executeAction({
			'Name': '/SAPAssetManager/Actions/Page/CancelPage.action',
			'Properties': {
				'OnSuccess': '/SAPAssetManager/Rules/DeepLinks/RunDeepLink.js',
			},
		});
	}
	return RunDeepLink(clientAPI);
}

