import FormInstanceListQueryOptions from './FormInstanceListQueryOptions';
import libCom from '../../Common/Library/CommonLibrary';
/**
 * 
 * @param {IClientAPI} clientAPI 
 * @returns {Promise<number>}
 */
export default function FormInstanceCount(clientAPI, checkMandatory = false, readLink) {
    const pageProxy = clientAPI.getPageProxy();
    const queryOptions = FormInstanceListQueryOptions(pageProxy, true, checkMandatory);
    const binding = pageProxy.binding || clientAPI.binding || pageProxy.getActionBinding() || libCom.getBindingObject(clientAPI); //Handle alternate bindings
    
    if (!readLink) {
        return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/DynamicFormLinkage_Nav`, queryOptions);
    } else {
        return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', `${readLink}/DynamicFormLinkage_Nav`, queryOptions);
    }
}
