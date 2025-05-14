import Logger from '../../Log/Logger';

/**
 * 
 * @param {IClientAPI} context 
 * @returns {Promise<string>}
 */
export default function FormInstanceData(context) {
    const docId = context.binding.FormInstanceID;

    if (docId) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'DynamicFormInstances', [], `$select=Content&$filter=FormInstanceID eq '${docId}'`).then(function(results) {
            if (results && results.length > 0 && results._array[0].Content !== '') {
                return results._array[0].Content;                              
            } else {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), `Form instance empty or not found: ${docId}`);
                return context.executeAction('/SAPAssetManager/Actions/Forms/SDF/FormInstanceNotFound.action');
            }
        }).catch((err) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), `Failed to read form instance: ${err}`);
            return '';
        });
    } else {
        return Promise.resolve('');
    }
}
 
