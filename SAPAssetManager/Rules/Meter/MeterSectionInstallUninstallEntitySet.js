import MeterSectionLibrary from './Common/MeterSectionLibrary';

/**
* Extension doesn't support MDK props in the sting, so need to call a rule to resolve this
* @param {IClientAPI} clientAPI
*/
export default function MeterSectionInstallUninstallEntitySet(clientAPI) {
    const binding = MeterSectionLibrary.getWorkOrderBinding(clientAPI, clientAPI.getPageProxy().binding);
    
    if (binding['@odata.readLink']) {
        return `${binding['@odata.readLink']}/OrderISULinks`;
    }
    // return default value if no meters available
    return '{{#Property:@odata.readLink}}/OrderISULinks';
}
