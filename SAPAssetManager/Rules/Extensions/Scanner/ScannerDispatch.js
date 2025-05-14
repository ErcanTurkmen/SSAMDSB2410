
import Logger from '../../Log/Logger';

export default async function ScannerDispatch(context, scanResult) {
    const scannerConfig = context.getGlobalDefinition('/SAPAssetManager/Globals/Scanner/ThirdPartyScannerConfig.global').getValue();
    try {
        context.showActivityIndicator();
        const params = await context.read('/SAPAssetManager/Services/AssetManager.service',
            'AppParameters', [], `$filter=ParamGroup eq '${scannerConfig}'`);
        if (params?.length > 0) {
            const promises = [], configs = [];
            for (let i = 0; i < params.length; i++) {
                configs.push(JSON.parse(params.getItem(i).ParamValue));
                promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', params.getItem(i).ParameterName, [],
                    `$filter=${configs[configs.length - 1].ScanId} eq '${scanResult}'`));
            }
            const results = await Promise.all(promises);
            for (let i = 0; i < results?.length; i++) {
                if (results[i].length > 0) {
                    const binding = results[i].getItem(0);
                    context.getPageProxy().setActionBinding(binding);
                    context.dismissActivityIndicator();
                    return context.executeAction(configs[i].NavAction);
                }
            }
        }
        context.dismissActivityIndicator();
        return context.executeAction('/SAPAssetManager/Actions/Extensions/ScannerBarcodeNoMatch.action');
    } catch (err) {
        context.dismissActivityIndicator();
        Logger.error('ScannerDispatch', err);
        return false;
    }
}
