import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function InspectionCharacteristicsOnReturningEDT(clientAPI) {
    let sectionHeaderExtension = libCom.getStateVariable(clientAPI, 'SectionHeaderExtension');
    let attachmnets = libCom.getStateVariable(clientAPI, 'InspectionCharacteristicsAttachments');
    if (sectionHeaderExtension && attachmnets) {
        let linkValue = attachmnets.length + ' ' + clientAPI.localizeText('attachments');
        sectionHeaderExtension.setLink({
            'Value': linkValue,
            'Action': '/SAPAssetManager/Rules/InspectionCharacteristics/Update/AddAttachmentsNavEDT.js',
        });
    }
}
