import common from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';

/**
* Show/hide "Use Template" button
* @param {IClientAPI} context
*/
export default function ShowTemplateButton(context) {
	if (common.IsOnCreate(context)) {
		return context.count('/SAPAssetManager/Services/AssetManager.service', 'LongTextTemplates', '').then(count => {
			return count > 0;
		}).catch(error => {
			Logger.error('Error in ShowTemplateButton: ' + error);
			return false;
		});
	}

	return Promise.resolve(false);
}
