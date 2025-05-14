import Logger from '../../Log/Logger';

export default function NPCValues(context) {
	return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationProcessingContexts', [], '').then(values => {
		let retValues = [{ 'DisplayValue': context.localizeText('regular_work'), 'ReturnValue': '00' }];

		values.forEach(value => {
			retValues.push({ 'DisplayValue': value.Description, 'ReturnValue': value.ProcessingContext });
		});

		return retValues;
	}).catch((err) => {
		Logger.error('NPCValues', err);
		return [{ 'DisplayValue': context.localizeText('regular_work'), 'ReturnValue': '00' }];
	});
}
