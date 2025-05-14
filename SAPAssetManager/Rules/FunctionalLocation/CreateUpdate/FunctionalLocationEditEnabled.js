import enableAttachmentCreate from '../../UserAuthorizations/Attachments/EnableAttachmentCreate';
import enableAttachment from '../../UserAuthorizations/Attachments/EnableAttachment';
import libCom from '../../Common/Library/CommonLibrary';
import PersonaLibrary from '../../Persona/PersonaLibrary';
import IsEditTechObjectFeatureEnabled from '../../UserFeatures/IsEditTechObjectFeatureEnabled';

/**
* Disable edit for WCM operator
* Disable floc edit if it is not local and attachments are disabled
* Disable edit if Enable.FL.Edit parameter is set to N
* Disable edit of not local if CA_EDIT_TECH_OBJECT is off
*/
export default function FunctionalLocationEditEnabled(context) {
    if (PersonaLibrary.isWCMOperator(context) || libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.FL.Edit') === 'N') {
        return false;
    }
    return context.binding['@sap.isLocal'] || (enableAttachmentCreate(context) && enableAttachment(context)) || IsEditTechObjectFeatureEnabled(context);
}
