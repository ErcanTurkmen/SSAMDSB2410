import Logger from '../../Log/Logger';

/**
 * 
 * @param {IClientAPI} context 
 * @returns {Promise<string>} 
 */
export default function FormTemplateData(context) {

    let formName = context.binding.FormName;
    let applicationName = context.binding.AppName;
    let version = context.binding.FormVersion;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'DynamicFormTemplates', [], "$select=Content&$filter=FormName eq '" + formName + "' and AppName eq '" + applicationName + "' and FormVersion eq '" + version + "'").then(function(results) {
        if (results && results.length > 0 && results._array[0].Content !== '') {
            return results._array[0].Content;                              
        } else {
            Logger.error(`Form template not found or empty: ${applicationName} ${formName} ${version}`);
            return context.executeAction('/SAPAssetManager/Actions/Forms/SDF/FormTemplateNotFound.action');
        }
    }).catch((err) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySAPDynamicForms.global'), `Failed to read form template: ${err}`);
        return '';
    });
}
