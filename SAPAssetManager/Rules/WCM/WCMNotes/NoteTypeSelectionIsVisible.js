import IsLotoCertificate from '../SafetyCertificates/Details/IsLotoCertificate';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import WCMNotesLibrary from './WCMNotesLibrary';

export default async function NoteTypeSelectionIsVisible(context) {
    if (!libVal.evalIsEmpty(libCom.getStateVariable(context, WCMNotesLibrary.noteTypeStateVarName))) {
        return false;
    }

    const dataType = context.binding['@odata.type'];
    const isNotWorkApproval = dataType !== context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMApproval.global').getValue();
    const isCertificate = dataType === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WCMDocumentHeader.global').getValue();

    return isCertificate ?  await IsLotoCertificate(context) : isNotWorkApproval;
}
