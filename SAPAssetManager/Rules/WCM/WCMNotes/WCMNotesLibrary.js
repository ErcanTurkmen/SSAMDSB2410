import IsLotoCertificate from '../SafetyCertificates/Details/IsLotoCertificate';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import { WCMCertificateMobileStatuses } from '../SafetyCertificates/SafetyCertificatesLibrary';

export default class WCMNotesLibrary {

    static get noteTypeStateVarName() {
        return 'WCMNoteType';
    }

    static getTextTypeBySection(context, sectionName) {
        return (sectionName || context.getName()).replace('Section', '');
    }

    static async getListNoteTypesByObjectType(context) {
        const entityType = context.binding['@odata.type'];

        const defaultList = [context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/LongText.global').getValue()];

        switch (entityType) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue():
                return defaultList.concat([context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/RequalificationText.global').getValue()]);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue(): {
                const taggingTextType = context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/TaggingText.global').getValue();
                const untaggingTextType = context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/UntaggingText.global').getValue();

                return (await IsLotoCertificate(context) ? defaultList.concat([taggingTextType, untaggingTextType]) : defaultList);  
            }
            default:
                return defaultList;    
        }  
    }

    static async getListNoteTypesAllowedForCreationByObjectType(context) {
        const pageProxy = context.getPageProxy();
        const binding = pageProxy.binding;
        const entityType = binding['@odata.type'];

        switch (entityType) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue():
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue(): {
                const allowedSystemStatuses = [
                    context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Created.global').getValue(),
                    context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/ChangeMode.global').getValue(),
                ];

                if (allowedSystemStatuses.includes(binding.ActualSystemStatus)) {
                    return await this.getListNoteTypesByObjectType(pageProxy);
                }

                return [];
            }
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue(): {
                const list = await this.getListNoteTypesByObjectType(pageProxy);
                const certMobileStatus = await context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/PMMobileStatus`, [], '');

                if (!libVal.evalIsEmpty(certMobileStatus) && certMobileStatus.getItem(0).MobileStatus !== WCMCertificateMobileStatuses.Change) {
                    return list.filter(type => type !== context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/LongText.global').getValue());
                }

                return list;
            }
            default:
                return [];
        }
    }

    static getNotesEntitySet(context, navLinkOnly = false) {
        const binding = this.getObjectBinding(context);
        const readLink = binding['@odata.readLink'];
        const entityType = binding['@odata.type'];
        let navLink;

        switch (entityType) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue():
                navLink = 'WCMDocumentHeaderLongtexts';
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue():
                navLink = 'WCMApprovalLongtexts';
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue():
                navLink = 'WCMApplicationLongtext_Nav';
                break;
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue():
                navLink = 'WCMDocumentItemLongtexts';
                break;            
        }

        return navLinkOnly ? navLink : `${readLink}/${navLink}`;
    }

    static getNoteCaption(context, textType) {
        const type = textType || this.getTextTypeBySection(context);

        switch (type) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/RequalificationText.global').getValue():
                return context.localizeText('requalification_text');
            case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/TaggingText.global').getValue():
                return context.localizeText('tagging_text');
            case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/UntaggingText.global').getValue():
                return context.localizeText('untagging_text');
            case context.getGlobalDefinition('/SAPAssetManager/Globals/WCM/WCMNotesTextTypes/RejectionText.global').getValue():
                return context.localizeText('rejection_text');             
            default:
                return context.localizeText('long_text');        
        }
    }

    static getNoteQueryOptions(context, sectionName) {
        const textType = libVal.evalIsEmpty(sectionName) ? this.getNoteTextTypeForCreation(context) : this.getTextTypeBySection(context, sectionName);
        return `$filter=TextType eq '${textType}'`;
    }

    static getNoteTextTypeForCreation(context) {
        if (libCom.getPageName(context) === 'WCMAddNotePage') {
            return context.getControls()[0].getControl('NoteType').getValue().filterItems[0];
        }

        return libCom.getStateVariable(context, this.noteTypeStateVarName);
    }

    static async enableNoteCreateForObject(context) {
        const list = await this.getListNoteTypesAllowedForCreationByObjectType(context);
        return list.length > 0;
    }

    static async enableNoteCreateForSpecificTextType(context, textType) {
        const list = await this.getListNoteTypesAllowedForCreationByObjectType(context);
        return list.includes(textType || this.getNoteTextTypeForCreation(context));
    }

    static getLongTextEntitySet(context) {
        const binding = this.getObjectBinding(context);

        switch (binding['@odata.type']) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue():
                return 'WCMDocumentHeaderLongtexts';
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue():
                return 'WCMApprovalLongtexts';
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApplication.global').getValue():
                return 'WCMApplicationLongtexts';
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentItem.global').getValue():
                return 'WCMDocumentItemLongtexts';
            default:
                return '';           
        }
    }

    static getObjectBinding(context) {
        let binding = context.getPageProxy().binding;

        if (!libVal.evalIsEmpty(binding.objectBinding)) {
            binding = binding.objectBinding;
        }

        return binding;
    }
}
